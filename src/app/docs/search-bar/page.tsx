"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { formatForDisplay } from "@tanstack/react-hotkeys"
import {
  BoxIcon,
  ComponentIcon,
  DatabaseIcon,
  LayoutIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
  TextIcon,
} from "lucide-react"
import { useState } from "react"

type Item = {
  id: string
  label: string
  group: string
  icon: React.ComponentType<{ className?: string }>
}

const items: Item[] = [
  { id: "button", label: "Button", group: "ui", icon: BoxIcon },
  { id: "input", label: "Input", group: "ui", icon: TextIcon },
  { id: "card", label: "Card", group: "ui", icon: LayoutIcon },
  { id: "table", label: "Table", group: "ui", icon: TableIcon },
  { id: "data-table", label: "Data Table", group: "utilities", icon: DatabaseIcon },
  { id: "combobox", label: "Combobox", group: "utilities", icon: ComponentIcon },
  { id: "search-bar", label: "Search Bar", group: "utilities", icon: SearchIcon },
  { id: "form", label: "Form", group: "utilities", icon: SettingsIcon },
]

const groups = [
  { key: "ui", label: "UI", items: items.filter((i) => i.group === "ui") },
  { key: "utilities", label: "Utilities", items: items.filter((i) => i.group === "utilities") },
]

const code = `import { SearchBar } from "@/components/search-bar"

type Item = { id: string; label: string; group: string }

export function Example() {
  const [active, setActive] = useState("")

  return (
    <SearchBar
      searchLabel="Search components..."
      noResultsLabel="No components found"
      description="Find UI components and utilities"
      groups={groups}
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.label}
      getItemIcon={(item) => item.icon}
      getItemKeywords={(item, group) => [group.label]}
      isActive={(item) => item.id === active}
      onSelect={(item) => setActive(item.id)}
    >
      <Button variant="outline">
        <SearchIcon className="size-4" />
        Search components...
      </Button>
    </SearchBar>
  )
}`

function LiveExample() {
  const [active, setActive] = useState("")
  return (
    <SearchBar
      searchLabel="Search components..."
      noResultsLabel="No components found"
      description="Find UI components and utilities"
      groups={groups}
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.label}
      getItemIcon={(item) => item.icon}
      getItemKeywords={(item, group) => [group.label]}
      isActive={(item) => item.id === active}
      onSelect={(item) => setActive(item.id)}
      hotkey="Mod+K"
    >
      <Button variant="outline">
        <SearchIcon className="size-4" />
        <Kbd>{formatForDisplay("Mod+K")}</Kbd>
        Search components...
      </Button>
    </SearchBar>
  )
}

export default function SearchBarPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">SearchBar</h1>
        <p className="mt-1 text-muted-foreground">
          A generic grouped search dialog. Pass any data type with accessor functions.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={code}>
          <LiveExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pr-4 pb-2 font-medium">Prop</th>
              <th className="pr-4 pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["searchLabel", "string", "Dialog title and input placeholder"],
              ["noResultsLabel", "string", "Text shown when no results match"],
              ["description", "string", "Subtitle shown in the dialog header"],
              ["groups", "SearchGroup<T>[]", "Array of { key, label, items[] }"],
              ["getItemKey", "(item: T) => string", "Returns a unique key for each item"],
              ["getItemLabel", "(item: T) => string", "Returns the display label for each item"],
              [
                "getItemIcon",
                "(item: T) => ComponentType",
                "Returns the icon component for each item",
              ],
              [
                "getItemKeywords",
                "(item, group) => string[]",
                "Returns searchable keywords for each item",
              ],
              ["isActive", "(item: T) => boolean", "Highlights the item when true"],
              ["onSelect", "(item: T) => void", "Called when an item is clicked"],
              ["children", "ReactNode", "The trigger element that opens the dialog"],
            ].map(([prop, type, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
