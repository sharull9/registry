"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import { InstallCommand } from "@/components/docs/install-command"
import { CreateOrgForm } from "@/components/auth/create-org-form"

function CreateOrgFormDemo() {
  return (
    <div className="w-full max-w-sm">
      <CreateOrgForm onCreated={(id) => console.log("created", id)} />
    </div>
  )
}

const defaultCode = `import { CreateOrgForm } from "@/components/auth/create-org-form"

export function Example() {
  return (
    <CreateOrgForm
      onCreated={(id) => console.log("created", id)}
    />
  )
}

// Inside a dialog:
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"

export function DialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Organizations let you collaborate with your team.</DialogDescription>
        </DialogHeader>
        <CreateOrgForm
          onCreated={(id) => { setOpen(false); console.log("created", id) }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}`

export default function CreateOrgFormPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">CreateOrgForm</h1>
        <p className="mt-1 text-muted-foreground">
          Headless form that creates a new organization via Better Auth. Drop it
          anywhere — a dialog, a page, a drawer. The slug auto-fills from the
          name until the user edits it manually. Requires the{" "}
          <code className="font-mono text-xs">organization</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/create-org-form" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Preview</h2>
        <ComponentPreview code={defaultCode} fileName="create-org-form-example.tsx">
          <CreateOrgFormDemo />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pr-4 pb-2 font-medium">Prop</th>
              <th className="pr-4 pb-2 font-medium">Type</th>
              <th className="pr-4 pb-2 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              [
                "onCreated",
                "(organizationId: string) => void",
                "—",
                "Called with the new org id after a successful create",
              ],
              [
                "onCancel",
                "() => void",
                "—",
                "If provided, renders a Cancel button that calls this",
              ],
              ["className", "string", "—", "Extra classes on the form element"],
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
      </section>
    </div>
  )
}
