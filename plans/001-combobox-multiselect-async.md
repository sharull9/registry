# Plan 001: Extend Combobox with multi-select, clear, and async search

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 69a8491..HEAD -- src/components/combobox.tsx src/app/docs/combobox/page.tsx`
> If either file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `69a8491`, 2026-06-26

## Why this matters

The existing `Combobox` only supports single-selection and local (cmdk-built-in) filtering.
The four requested capabilities — multi-select with clear, explicit display/value separation,
keyword search (already partially there), and API-driven async search — together make the
component usable for real product screens like "filter by tags", "pick assignees", or any
typeahead backed by a server endpoint. Without them, callers re-implement each feature
ad-hoc, causing diverging UX patterns across the codebase.

## Current state

### Files in scope

- `src/components/combobox.tsx` — the component; all exports live here
- `src/app/docs/combobox/page.tsx` — the documentation/demo page; must be updated to showcase new features

### Current `ComboboxProps` (lines 25–40 of `src/components/combobox.tsx`)

```tsx
export type ComboboxProps = {
  value: string
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
  options: ComboboxOption[]
  isPending: boolean
  isError: boolean
  onValueChange: (value: string) => void
  disabled?: boolean
  includeAll?: boolean
  className?: string
  errorMessage?: string
  selectedLabel?: string
  icon?: React.ReactNode
}
```

### Current render body (lines 58–139 of `src/components/combobox.tsx`)

Key observations:
- `open` state is the only local state
- `onSelect` sets `open(false)` immediately (single-select close-on-pick)
- `value === option.id` determines `data-checked`
- cmdk's built-in filtering is active (`shouldFilter` not set → defaults to `true`)
- `CommandItem` already accepts a `keywords` prop (lines 119–122); this feature works today

### CommandItem checked visual (from `src/components/ui/command.tsx` line 164)

```tsx
<CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
```

The `data-checked` attribute on `CommandItem` drives the checkmark — keep using it.

### Badge component (from `src/components/ui/badge.tsx`)

```tsx
import { Badge } from "@/components/ui/badge"
// Usage: <Badge variant="secondary">label</Badge>
```

Available variants: `default`, `secondary`, `outline`, `ghost`. Use `secondary` for selected-value badges inside the trigger button.

### Commit style (from `git log --oneline -5`)

```
feat: enhance data table and search bar with improved filtering and hotkey functionality
```

Use conventional commits: `feat: <short imperative description>`.

## Commands you will need

| Purpose   | Command            | Expected on success       |
|-----------|--------------------|---------------------------|
| Typecheck | `pnpm types:check` | exit 0, no errors printed |

There are no automated tests in this repo — the test plan below covers manual verification only.

## Scope

**In scope** (the only files you should modify):
- `src/components/combobox.tsx`
- `src/app/docs/combobox/page.tsx`

**Out of scope** (do NOT touch):
- `src/components/ui/command.tsx` — shared primitive; changing it affects the whole app
- `src/components/ui/badge.tsx` — import and use as-is
- Any other page or component file

## Git workflow

- Branch: `feat/combobox-multiselect-async`
- Commit after each logical step
- Message style: `feat: <short imperative description>`
- Do NOT push or open a PR unless instructed

## Steps

### Step 1: Extend the type definitions

Open `src/components/combobox.tsx`. Replace the `ComboboxProps` type (lines 25–40) with the following. Keep `ComboboxOption` unchanged.

```tsx
export type ComboboxProps = {
  // --- value ---
  /** When `multiple` is false (default): the selected option id, or "" for none */
  value: string
  /** Called with the newly selected id (single mode) */
  onValueChange: (value: string) => void

  // --- multi-select (optional) ---
  /** Enable multi-select mode */
  multiple?: boolean
  /** When `multiple` is true: the array of selected option ids */
  values?: string[]
  /** Called with the updated id array (multi mode) */
  onValuesChange?: (values: string[]) => void

  // --- display ---
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
  options: ComboboxOption[]
  isPending: boolean
  isError: boolean

  // --- async search (optional) ---
  /**
   * When provided, disables cmdk's built-in local filtering.
   * The parent is responsible for updating `options` in response to the query.
   * Called with the current search string (debounced 300 ms inside the component).
   */
  onSearch?: (query: string) => void

  // --- misc ---
  disabled?: boolean
  includeAll?: boolean
  className?: string
  errorMessage?: string
  /**
   * Override the text shown in the trigger for the selected value(s).
   * In multi mode this replaces the badge list entirely when provided.
   */
  selectedLabel?: string
  icon?: React.ReactNode
}
```

**Verify**: `pnpm types:check` — expect errors because the function signature still uses the old type; that is expected at this step, they will be resolved in Step 2.

---

### Step 2: Rewrite the component function

Replace the entire `Combobox` function (lines 42–139) with the implementation below.
Do not remove imports at the top of the file; you will add two new ones in Step 3.

```tsx
export function Combobox({
  value,
  onValueChange,
  multiple = false,
  values = [],
  onValuesChange,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  options: rawOptions,
  isPending,
  isError,
  onSearch,
  disabled,
  includeAll,
  className,
  errorMessage,
  selectedLabel,
  icon: Icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Debounce onSearch calls — only fires when onSearch is provided
  const debouncedSearch = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = React.useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (!onSearch) return
      if (debouncedSearch.current) clearTimeout(debouncedSearch.current)
      debouncedSearch.current = setTimeout(() => {
        onSearch(query)
      }, 300)
    },
    [onSearch]
  )

  // Clean up debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (debouncedSearch.current) clearTimeout(debouncedSearch.current)
    }
  }, [])

  const options = includeAll ? [{ id: "", label: "All" }, ...rawOptions] : rawOptions

  // --- single-select helpers ---
  const selectedOption = options.find((o) => o.id === value)

  // --- multi-select helpers ---
  const isSelected = (id: string) => values.includes(id)
  const toggleValue = (id: string) => {
    if (!onValuesChange) return
    onValuesChange(isSelected(id) ? values.filter((v) => v !== id) : [...values, id])
  }
  const clearValues = () => onValuesChange?.([])
  const selectedOptions = options.filter((o) => values.includes(o.id))

  // --- trigger label ---
  const triggerContent = (() => {
    if (selectedLabel) {
      return <span className="truncate text-foreground">{selectedLabel}</span>
    }
    if (multiple) {
      if (selectedOptions.length === 0) {
        return <span className="truncate text-muted-foreground">{placeholder}</span>
      }
      return (
        <span className="flex min-w-0 flex-wrap gap-1">
          {selectedOptions.map((o) => (
            <Badge key={o.id} variant="secondary" className="shrink-0">
              {o.label}
            </Badge>
          ))}
        </span>
      )
    }
    return (
      <span className={selectedOption ? "truncate text-foreground" : "truncate text-muted-foreground"}>
        {selectedOption?.label ?? placeholder}
      </span>
    )
  })()

  const hasClearable = multiple && values.length > 0

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={isPending || disabled}>
        <Button
          className={cn("min-w-40 justify-between font-normal", className)}
          role="combobox"
          variant="outline"
        >
          {isPending ? <Spinner /> : Icon ? Icon : null}
          {triggerContent}
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {hasClearable && (
              <span
                role="button"
                aria-label="Clear selection"
                className="rounded-sm opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  clearValues()
                }}
              >
                <XIcon className="size-4" />
              </span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command
          // Disable built-in filtering when the parent drives search via onSearch
          shouldFilter={!onSearch}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isPending ? (
              <Empty className="min-h-20 border-0 p-3 text-muted-foreground" role="status">
                <EmptyHeader>
                  <EmptyMedia>
                    <Spinner />
                  </EmptyMedia>
                  <EmptyTitle>Loading</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : isError ? (
              <Empty className="min-h-20 border-0 p-3 text-destructive" role="alert">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertCircleIcon />
                  </EmptyMedia>
                  <EmptyTitle>Error</EmptyTitle>
                  {errorMessage && <EmptyDescription>{errorMessage}</EmptyDescription>}
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                <CommandEmpty>
                  <Empty className="min-h-20 border-0 p-3">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchIcon />
                      </EmptyMedia>
                      <EmptyTitle>{emptyLabel}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const checked = multiple ? isSelected(option.id) : value === option.id
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        keywords={[option.label, ...(option.keywords ?? [])]}
                        data-checked={checked}
                        onSelect={() => {
                          if (multiple) {
                            toggleValue(option.id)
                            // Stay open for multi-select; user closes manually
                          } else {
                            setOpen(false)
                            onValueChange(option.id)
                          }
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

**Verify**: `pnpm types:check` — still expects errors until Step 3 adds missing imports.

---

### Step 3: Add missing imports

At the top of `src/components/combobox.tsx`, locate the existing import lines.

**Current lucide import (line 16):**
```tsx
import { AlertCircleIcon, ChevronsUpDown, SearchIcon } from "lucide-react"
```

**Replace with:**
```tsx
import { AlertCircleIcon, ChevronsUpDown, SearchIcon, XIcon } from "lucide-react"
```

**Add after the existing `import { cn } from "@/lib/utils"` line:**
```tsx
import { Badge } from "@/components/ui/badge"
```

**Verify**: `pnpm types:check` — should exit 0 with no errors.

---

### Step 4: Update the docs page

Replace the entire contents of `src/app/docs/combobox/page.tsx` with the following.
This adds four example sections (Basic, With All, Multi-select, Async Search) and an updated props table.

```tsx
"use client"

import { Combobox, type ComboboxOption } from "@/components/combobox"
import { ComponentPreview } from "@/components/docs/component-preview"
import { useState, useEffect } from "react"

const frameworks: ComboboxOption[] = [
  { id: "next", label: "Next.js", keywords: ["react", "ssr"] },
  { id: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { id: "nuxt", label: "Nuxt.js", keywords: ["vue", "ssr"] },
  { id: "remix", label: "Remix", keywords: ["react", "full-stack"] },
  { id: "astro", label: "Astro", keywords: ["static", "islands"] },
]

// --------------- code snippets ---------------

const basicCode = `import { Combobox } from "@/components/combobox"
import { useState } from "react"

const options = [
  { id: "next", label: "Next.js", keywords: ["react", "ssr"] },
  { id: "sveltekit", label: "SvelteKit" },
  { id: "nuxt", label: "Nuxt.js", keywords: ["vue"] },
]

export function Example() {
  const [value, setValue] = useState("")

  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={options}
      placeholder="Select framework..."
      searchPlaceholder="Search frameworks..."
      emptyLabel="No framework found"
      isPending={false}
      isError={false}
    />
  )
}`

const withAllCode = `<Combobox
  value={value}
  onValueChange={setValue}
  options={options}
  placeholder="Select framework..."
  searchPlaceholder="Search frameworks..."
  emptyLabel="No framework found"
  isPending={false}
  isError={false}
  includeAll
/>`

const multiCode = `const [values, setValues] = useState<string[]>([])

<Combobox
  value=""
  onValueChange={() => {}}
  multiple
  values={values}
  onValuesChange={setValues}
  options={options}
  placeholder="Select frameworks..."
  searchPlaceholder="Search frameworks..."
  emptyLabel="No framework found"
  isPending={false}
  isError={false}
/>`

const asyncCode = `const [options, setOptions] = useState(allOptions)
const [isPending, setIsPending] = useState(false)

async function handleSearch(query: string) {
  setIsPending(true)
  const results = await fetchFrameworks(query)
  setOptions(results)
  setIsPending(false)
}

<Combobox
  value={value}
  onValueChange={setValue}
  options={options}
  onSearch={handleSearch}
  placeholder="Select framework..."
  searchPlaceholder="Search frameworks..."
  emptyLabel="No framework found"
  isPending={isPending}
  isError={false}
/>`

// --------------- examples ---------------

function BasicExample() {
  const [value, setValue] = useState("")
  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={frameworks}
      placeholder="Select framework..."
      searchPlaceholder="Search frameworks..."
      emptyLabel="No framework found"
      isPending={false}
      isError={false}
    />
  )
}

function WithAllExample() {
  const [value, setValue] = useState("")
  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={frameworks}
      placeholder="Select framework..."
      searchPlaceholder="Search frameworks..."
      emptyLabel="No framework found"
      isPending={false}
      isError={false}
      includeAll
    />
  )
}

function MultiExample() {
  const [values, setValues] = useState<string[]>([])
  return (
    <Combobox
      value=""
      onValueChange={() => {}}
      multiple
      values={values}
      onValuesChange={setValues}
      options={frameworks}
      placeholder="Select frameworks..."
      searchPlaceholder="Search frameworks..."
      emptyLabel="No framework found"
      isPending={false}
      isError={false}
    />
  )
}

function AsyncExample() {
  const [value, setValue] = useState("")
  const [options, setOptions] = useState(frameworks)
  const [isPending, setIsPending] = useState(false)

  const handleSearch = (query: string) => {
    setIsPending(true)
    // Simulate an API call with 400 ms delay
    setTimeout(() => {
      setOptions(
        query
          ? frameworks.filter(
              (f) =>
                f.label.toLowerCase().includes(query.toLowerCase()) ||
                f.keywords?.some((k) => k.includes(query.toLowerCase()))
            )
          : frameworks
      )
      setIsPending(false)
    }, 400)
  }

  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={options}
      onSearch={handleSearch}
      placeholder="Select framework..."
      searchPlaceholder="Type to search..."
      emptyLabel="No framework found"
      isPending={isPending}
      isError={false}
    />
  )
}

// --------------- page ---------------

export default function ComboboxPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Combobox</h1>
        <p className="mt-1 text-muted-foreground">
          A searchable select built on a popover command palette. Supports single
          and multi-select, loading and error states, and async (API-driven) search.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={basicCode}>
          <BasicExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">With "All" option</h2>
        <ComponentPreview code={withAllCode}>
          <WithAllExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Multi-select</h2>
        <p className="text-sm text-muted-foreground">
          Pass <code>multiple</code>, <code>values</code>, and{" "}
          <code>onValuesChange</code>. The popover stays open for batch picking.
          A clear (✕) button appears in the trigger when items are selected.
        </p>
        <ComponentPreview code={multiCode}>
          <MultiExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Async search</h2>
        <p className="text-sm text-muted-foreground">
          Pass <code>onSearch</code> to opt out of local filtering. The component
          debounces the callback by 300 ms and sets <code>shouldFilter=false</code>{" "}
          on the underlying Command. Update <code>options</code> and{" "}
          <code>isPending</code> from your data-fetching layer.
        </p>
        <ComponentPreview code={asyncCode}>
          <AsyncExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Required</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["value", "string", "Yes", "Selected option id (single mode)"],
              ["onValueChange", "(value: string) => void", "Yes", "Called on selection change (single mode)"],
              ["options", "ComboboxOption[]", "Yes", "Array of { id, label, keywords? }"],
              ["placeholder", "string", "Yes", "Text shown when nothing is selected"],
              ["searchPlaceholder", "string", "Yes", "Placeholder inside the search input"],
              ["emptyLabel", "string", "Yes", "Text shown when no options match the query"],
              ["isPending", "boolean", "Yes", "Shows loading spinner when true"],
              ["isError", "boolean", "Yes", "Shows error state when true"],
              ["multiple", "boolean", "No", "Enable multi-select mode"],
              ["values", "string[]", "No (multi mode)", "Selected ids array (multi mode)"],
              ["onValuesChange", "(values: string[]) => void", "No (multi mode)", "Called when selection changes (multi mode)"],
              ["onSearch", "(query: string) => void", "No", "Async search handler; disables local filtering when provided (debounced 300 ms)"],
              ["includeAll", "boolean", "No", 'Prepends an "All" option with id ""'],
              ["errorMessage", "string", "No", "Message shown in error state"],
              ["selectedLabel", "string", "No", "Override the display text in the trigger"],
              ["icon", "ReactNode", "No", "Icon shown in the trigger button"],
              ["disabled", "boolean", "No", "Disables the trigger button"],
            ].map(([prop, type, req, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td className="py-2 pr-4">{req}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
```

**Verify**: `pnpm types:check` — exit 0, no errors.

---

### Step 5: Final check — open the app

Run the dev server (`pnpm dev`) and navigate to the `/docs/combobox` page. Manually verify:

1. **Basic**: selecting an option closes the popover and shows the label in the trigger.
2. **With All**: "All" option appears at the top; selecting it stores `""`.
3. **Multi-select**: clicking options toggles checkmarks without closing; selected items appear as badges in the trigger; the ✕ button clears all selections.
4. **Async search**: typing in the search box triggers the simulated API (spinner appears briefly) and results update.

## Test plan

No automated test infrastructure exists in this repo. Perform the manual checks in Step 5.
When test infrastructure is added in the future, the following cases should be the first
tests written for this component:

- Single mode: selecting an option calls `onValueChange` with the option's `id`
- Multi mode: toggling an option updates `values`; toggling it again removes it; clear button resets to `[]`
- Async mode: `onSearch` is called with the debounced query, not on every keystroke
- Popover stays open in multi mode, closes on select in single mode
- `shouldFilter=false` is set on `Command` when `onSearch` is provided

## Done criteria

- [ ] `pnpm types:check` exits 0, no errors
- [ ] `/docs/combobox` page renders all four examples without console errors
- [ ] Single-select closes popover on pick; multi-select stays open
- [ ] Clear (✕) button appears in multi trigger when `values.length > 0`; clicking it resets to `[]` without closing the popover
- [ ] Async example shows spinner while "fetching" and updates results after 400 ms
- [ ] No files outside `src/components/combobox.tsx` and `src/app/docs/combobox/page.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row updated to DONE

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the locations in "Current state" doesn't match the excerpts (codebase drifted since SHA `69a8491`).
- `pnpm types:check` still fails after Step 3 with errors not obviously caused by the new code.
- `CommandInput` in `src/components/ui/command.tsx` does not accept a `value` + `onValueChange` pair (the primitive changed).
- The `Badge` component is not exported from `src/components/ui/badge.tsx`.
- Touching a file outside the in-scope list is required to make typecheck pass.

## Maintenance notes

- **Keyword search**: already works via cmdk's built-in `keywords` prop on `CommandItem`. When `onSearch` is NOT provided, cmdk filters options locally using both `value` (the `option.id`) and `keywords` (the array). No change needed to `ComboboxOption`; callers just populate `keywords`.
- **Display vs. stored value**: `id` is always what's stored; `label` (or `selectedLabel`) is always what's displayed. This is the existing contract — the plan preserves it.
- **Debounce timer**: the 300 ms debounce lives inside the component via a `useRef`. If callers need a different delay, consider making it a prop (`searchDebounce?: number`) in a follow-up.
- **Multi mode and `includeAll`**: "All" option in multi mode has no special semantics today — it toggles like any other option. If "All = select everything / clear all" semantics are needed, that's a separate feature.
- **PR reviewer focus**: confirm `shouldFilter` is wired to `!onSearch` (not hardcoded), and that the debounce cleanup fires in the `useEffect` return. Check the clear button's `onClick` uses `e.stopPropagation()` so it doesn't toggle the popover.
