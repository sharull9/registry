"use client"

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
import { authClient } from "@/lib/auth-client"
import { useState, useTransition } from "react"

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export type CreateOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the created organization id after a successful create. */
  onCreated?: (organizationId: string) => void
}

/**
 * Dialog that creates a new organization. The slug auto-fills from the name
 * until the user edits it manually.
 */
export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateOrganizationDialogProps) {
  const [name, setName] = useState("")
  const [slugInput, setSlugInput] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  // Derived during render: auto-follows the name until the user edits it.
  const slug = slugEdited ? slugInput : slugify(name)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("")
      setSlugInput("")
      setSlugEdited(false)
      setError("")
    }
    onOpenChange(next)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !slug) return
    setError("")
    startTransition(async () => {
      const { data, error } = await authClient.organization.create({
        name,
        slug,
      })
      if (error) {
        setError(error.message ?? "Failed to create organization")
        return
      }
      handleOpenChange(false)
      if (data?.id) onCreated?.(data.id)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>Organizations let you collaborate with your team.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-org-name">Name</Label>
              <Input
                id="create-org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc."
                autoFocus
                disabled={isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-org-slug">Slug</Label>
              <Input
                id="create-org-slug"
                value={slug}
                onChange={(e) => {
                  setSlugInput(slugify(e.target.value))
                  setSlugEdited(true)
                }}
                placeholder="acme"
                disabled={isPending}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
