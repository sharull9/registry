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

const basicCode = `import { Combobox } from "@/components/combobox"

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

export default function ComboboxPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Combobox</h1>
        <p className="mt-1 text-muted-foreground">
          A searchable select built on a popover command palette. Supports loading and error states.
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
              ["value", "string", "Yes", "The selected option id"],
              ["onValueChange", "(value: string) => void", "Yes", "Called when selection changes"],
              ["options", "ComboboxOption[]", "Yes", "Array of { id, label, keywords? }"],
              ["placeholder", "string", "Yes", "Text shown when no value selected"],
              ["searchPlaceholder", "string", "Yes", "Placeholder inside the search input"],
              ["emptyLabel", "string", "Yes", "Text shown when no options match"],
              ["isPending", "boolean", "Yes", "Shows spinner when true"],
              ["isError", "boolean", "Yes", "Shows error state when true"],
              ["includeAll", "boolean", "No", 'Prepends an "All" option with id ""'],
              ["errorMessage", "string", "No", "Message shown in error state"],
              ["selectedLabel", "string", "No", "Override the displayed label for selected value"],
              ["icon", "ReactNode", "No", "Icon shown in the trigger button"],
              ["disabled", "boolean", "No", "Disables the trigger"],
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
