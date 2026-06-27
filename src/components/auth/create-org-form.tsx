"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export type CreateOrgFormProps = {
  /** Called with the created organization id after a successful create. */
  onCreated?: (organizationId: string) => void
  /** If provided, renders a Cancel button that calls this. */
  onCancel?: () => void
  className?: string
}

export function CreateOrgForm({ onCreated, onCancel, className }: CreateOrgFormProps) {
  const [name, setName] = useState("")
  const [slugInput, setSlugInput] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const slug = slugEdited ? slugInput : slugify(name)

  function reset() {
    setName("")
    setSlugInput("")
    setSlugEdited(false)
    setError("")
  }

  function handleCancel() {
    reset()
    onCancel?.()
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !slug) return
    setError("")
    startTransition(async () => {
      const { data, error } = await authClient.organization.create({ name, slug })
      if (error) {
        setError(error.message ?? "Failed to create organization")
        return
      }
      reset()
      if (data?.id) onCreated?.(data.id)
    })
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)}>
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
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create"}
        </Button>
      </div>
    </form>
  )
}
