"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import { PasswordInput } from "@/components/password-input"
import { useState } from "react"

const basicCode = `import { PasswordInput } from "@/components/password-input"

export function Example() {
  const [value, setValue] = useState("")

  return (
    <PasswordInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}`

function LiveExample() {
  const [value, setValue] = useState("")
  return (
    <div className="w-full max-w-sm">
      <PasswordInput value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  )
}

export default function PasswordInputPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">PasswordInput</h1>
        <p className="mt-1 text-muted-foreground">
          A password field with a toggle button to reveal or hide the value.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={basicCode}>
          <LiveExample />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["visibilityState", '"password" | "text"', "—", "Controlled visibility state"],
              ["onVisibilityChange", "(state) => void", "—", "Called when visibility toggles"],
              ["visibleIcon", "ReactNode", "<EyeIcon />", "Icon shown when password is hidden"],
              ["hiddenIcon", "ReactNode", "<EyeOffIcon />", "Icon shown when password is visible"],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td className="py-2 pr-4 font-mono">{def}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-muted-foreground">
          Also accepts all <code className="font-mono">InputGroupInput</code> props (e.g.{" "}
          <code className="font-mono">value</code>, <code className="font-mono">onChange</code>,{" "}
          <code className="font-mono">disabled</code>).
        </p>
      </section>
    </div>
  )
}
