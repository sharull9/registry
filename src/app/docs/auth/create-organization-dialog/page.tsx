"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import { InstallCommand } from "@/components/docs/install-command"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

function CreateOrgDialogDemo() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Organizations let you collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="demo-org-name">Name</Label>
              <Input
                id="demo-org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc."
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="demo-org-slug">Slug</Label>
              <Input
                id="demo-org-slug"
                value={slug}
                readOnly
                placeholder="acme"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const defaultCode = `import { useState } from "react"
import { CreateOrganizationDialog } from "@/components/auth/create-organization-dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>New organization</Button>
      <CreateOrganizationDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(id) => console.log("created", id)}
      />
    </>
  )
}`

export default function CreateOrganizationDialogPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">CreateOrganizationDialog</h1>
        <p className="mt-1 text-muted-foreground">
          Controlled dialog that creates a new organization via Better Auth. The
          slug auto-fills from the name until the user edits it manually.
          Requires the{" "}
          <code className="font-mono text-xs">organization</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/create-organization-dialog" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Preview</h2>
        <ComponentPreview code={defaultCode} fileName="create-org-dialog-example.tsx">
          <CreateOrgDialogDemo />
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
              ["open", "boolean", "—", "Controlled open state"],
              ["onOpenChange", "(open: boolean) => void", "—", "Called when the dialog opens or closes"],
              [
                "onCreated",
                "(organizationId: string) => void",
                "—",
                "Called with the new org id after a successful create",
              ],
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
