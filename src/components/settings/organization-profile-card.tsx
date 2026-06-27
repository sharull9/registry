"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { Building2 } from "lucide-react"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card to view and update the active organization's name and slug.
 * Reads the active organization itself, so it can be used independently.
 */
export function OrganizationProfileCard({ className }: { className?: string }) {
  const {
    data: org,
    isPending,
    refetch,
  } = useAuthList(() => authClient.organization.getFullOrganization())
  const [saving, startSave] = useTransition()
  const [error, setError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)

  const ready = !isPending && !!org

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value.trim()
    const slug = slugRef.current?.value.trim()
    if (!name || !slug || !org) return
    setError("")
    startSave(async () => {
      const { error } = await authClient.organization.update({
        organizationId: org.id,
        data: { name, slug },
      })
      if (error) setError(error.message ?? "Failed to update organization")
      else refetch()
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Organization profile</CardTitle>
        <CardDescription>Update your organization name and URL.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {ready ? (
              <Avatar size="lg">
                <AvatarImage src={org.logo ?? undefined} />
                <AvatarFallback>
                  <Building2 className="size-4" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="size-10 rounded-full" />
            )}
            <div className="text-sm">
              {ready ? (
                <>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-muted-foreground">/{org.slug}</p>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            {ready ? (
              <Input
                id="org-name"
                ref={nameRef}
                defaultValue={org.name}
                disabled={saving}
                required
              />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-slug">URL slug</Label>
            {ready ? (
              <Input
                id="org-slug"
                ref={slugRef}
                defaultValue={org.slug}
                disabled={saving}
                required
              />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="sm" className="self-start" disabled={saving || !ready}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
