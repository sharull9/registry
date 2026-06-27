"use client"

import { CreateOrganizationDialog } from "@/components/auth/create-organization-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Building2, Check, ChevronsUpDown, Plus, User } from "lucide-react"
import { useState } from "react"

function OrgAvatar({ name, logo }: { name?: string | null; logo?: string | null }) {
  return (
    <Avatar size="sm" className="rounded-md">
      <AvatarImage src={logo ?? undefined} />
      <AvatarFallback className="rounded-md">
        {name ? name.charAt(0).toUpperCase() : <Building2 className="size-3" />}
      </AvatarFallback>
    </Avatar>
  )
}

export type OrganizationSwitcherProps = {
  className?: string
  /** Hide the "Personal account" entry (active org = null). */
  hidePersonal?: boolean
  /** Hide the "Create organization" action. */
  hideCreate?: boolean
}

/**
 * Dropdown that shows the active organization and lets the user switch between
 * the organizations they belong to, fall back to a personal account, or create
 * a new organization.
 */
export function OrganizationSwitcher({
  className,
  hidePersonal,
  hideCreate,
}: OrganizationSwitcherProps) {
  const { data: orgs, isPending, refetch } = useAuthList(() => authClient.organization.list())
  const { data: activeOrg } = authClient.useActiveOrganization()
  const [createOpen, setCreateOpen] = useState(false)
  const [switching, setSwitching] = useState(false)

  async function setActive(organizationId: string | null) {
    setSwitching(true)
    await authClient.organization.setActive({ organizationId })
    setSwitching(false)
  }

  if (isPending) {
    return <Skeleton className={cn("h-10 w-56 rounded-md", className)} />
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={switching}
            className={cn("h-auto justify-between gap-2 px-2 py-1.5", className)}
          >
            <span className="flex min-w-0 items-center gap-2">
              {activeOrg ? (
                <OrgAvatar name={activeOrg.name} logo={activeOrg.logo} />
              ) : (
                <Avatar size="sm" className="rounded-md">
                  <AvatarFallback className="rounded-md">
                    <User className="size-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate text-sm font-medium">
                {activeOrg?.name ?? "Personal account"}
              </span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Organizations
          </DropdownMenuLabel>

          {!hidePersonal && (
            <DropdownMenuItem onClick={() => setActive(null)} className="gap-2">
              <Avatar size="sm" className="rounded-md">
                <AvatarFallback className="rounded-md">
                  <User className="size-3" />
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">Personal account</span>
              {!activeOrg && <Check className="size-4" />}
            </DropdownMenuItem>
          )}

          {orgs?.map((org) => (
            <DropdownMenuItem key={org.id} onClick={() => setActive(org.id)} className="gap-2">
              <OrgAvatar name={org.name} logo={org.logo} />
              <span className="flex-1 truncate">{org.name}</span>
              {activeOrg?.id === org.id && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}

          {!hideCreate && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCreateOpen(true)} className="gap-2">
                <span className="flex size-6 items-center justify-center rounded-md border border-dashed">
                  <Plus className="size-3" />
                </span>
                Create organization
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={async (id) => {
          await refetch()
          await setActive(id)
        }}
      />
    </>
  )
}
