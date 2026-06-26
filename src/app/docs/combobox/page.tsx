"use client"

import { Combobox, type ComboboxOption } from "@/components/combobox"
import { ComponentPreview } from "@/components/docs/component-preview"
import { useState } from "react"

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
  maxChips={2}
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
      maxChips={2}
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
          A searchable select built on a popover command palette. Supports single and multi-select,
          loading and error states, and async (API-driven) search.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={basicCode}>
          <BasicExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">With &quot;All&quot; option</h2>
        <ComponentPreview code={withAllCode}>
          <WithAllExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Multi-select</h2>
        <p className="text-sm text-muted-foreground">
          Pass <code>multiple</code>, <code>values</code>, and <code>onValuesChange</code>. The
          popover stays open for batch picking. A clear (✕) button appears in the trigger when items
          are selected. Use <code>maxChips</code> to cap visible badges (e.g. this demo shows 2).
        </p>
        <ComponentPreview code={multiCode}>
          <MultiExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Async search</h2>
        <p className="text-sm text-muted-foreground">
          Pass <code>onSearch</code> to opt out of local filtering. The component debounces the
          callback by 300 ms and sets <code>shouldFilter=false</code> on the underlying Command.
          Update <code>options</code> and <code>isPending</code> from your data-fetching layer.
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
              <th className="pr-4 pb-2 font-medium">Prop</th>
              <th className="pr-4 pb-2 font-medium">Type</th>
              <th className="pr-4 pb-2 font-medium">Required</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["value", "string", "Yes", "Selected option id (single mode)"],
              [
                "onValueChange",
                "(value: string) => void",
                "Yes",
                "Called on selection change (single mode)",
              ],
              ["options", "ComboboxOption[]", "Yes", "Array of { id, label, keywords? }"],
              ["placeholder", "string", "Yes", "Text shown when nothing is selected"],
              ["searchPlaceholder", "string", "Yes", "Placeholder inside the search input"],
              ["emptyLabel", "string", "Yes", "Text shown when no options match the query"],
              ["isPending", "boolean", "Yes", "Shows loading spinner when true"],
              ["isError", "boolean", "Yes", "Shows error state when true"],
              ["multiple", "boolean", "No", "Enable multi-select mode"],
              [
                "maxChips",
                "number",
                "No",
                "Max selected-value badges before '+N more' (multi mode)",
              ],
              ["values", "string[]", "No (multi mode)", "Selected ids array (multi mode)"],
              [
                "onValuesChange",
                "(values: string[]) => void",
                "No (multi mode)",
                "Called when selection changes (multi mode)",
              ],
              [
                "onSearch",
                "(query: string) => void",
                "No",
                "Async search handler; disables local filtering when provided (debounced 300 ms)",
              ],
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
