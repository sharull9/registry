"use client"

import { CreateOrgForm } from "@/components/auth/create-org-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Building2, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

export type OrganizationSelectionProps = {
  className?: string
  /** Called after an organization is selected/created and set active. */
  onSelected?: (organizationId: string) => void
}

/**
 * Full-screen gate for org-required flows. Lists the organizations the user
 * belongs to so they can pick one (sets it active), or create a new one. When
 * the user has none, it leads with the empty/create state.
 */
export function OrganizationSelection({ className, onSelected }: OrganizationSelectionProps) {
  const { data: orgs, isPending, refetch } = useAuthList(() => authClient.organization.list())
  const [createOpen, setCreateOpen] = useState(false)
  const [selectingId, setSelectingId] = useState<string | null>(null)

  async function select(organizationId: string) {
    setSelectingId(organizationId)
    await authClient.organization.setActive({ organizationId })
    setSelectingId(null)
    onSelected?.(organizationId)
  }

  const isEmpty = !isPending && (!orgs || orgs.length === 0)

  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col items-center gap-6 py-10", className)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">
          {isEmpty ? "Create your organization" : "Select an organization"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEmpty
            ? "You need an organization to continue."
            : "Choose an organization to continue, or create a new one."}
        </p>
      </div>

      <Card className="w-full p-0">
        <CardHeader className="sr-only">
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Pick one to continue</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex flex-col gap-4 p-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {orgs?.map((org, i) => (
                <div key={org.id}>
                  {i > 0 && <Separator />}
                  <button
                    type="button"
                    disabled={selectingId !== null}
                    onClick={() => select(org.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 disabled:opacity-60"
                  >
                    <Avatar size="sm" className="rounded-md">
                      <AvatarImage src={org.logo ?? undefined} />
                      <AvatarFallback className="rounded-md">
                        {org.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{org.name}</p>
                      <p className="truncate text-xs text-muted-foreground">/{org.slug}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </div>
              ))}
              {!isEmpty && <Separator />}
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <span className="flex size-9 items-center justify-center rounded-md border border-dashed">
                  <Plus className="size-4" />
                </span>
                Create organization
              </button>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>Organizations let you collaborate with your team.</DialogDescription>
          </DialogHeader>
          <CreateOrgForm
            onCreated={async (id) => {
              setCreateOpen(false)
              await refetch()
              await select(id)
            }}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
