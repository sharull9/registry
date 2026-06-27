"use client"

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
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

function UserAvatar({
  name,
  email,
  image,
}: {
  name?: string | null
  email?: string | null
  image?: string | null
}) {
  return (
    <Avatar size="sm">
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{(name || email || "U").charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export type MultiSessionSwitcherProps = {
  className?: string
  /** Href to the sign-in page used by the "Add account" action. */
  addAccountHref?: string
}

/**
 * Dropdown to switch between multiple signed-in accounts on this device
 * (Better Auth `multiSession` plugin), or add another account.
 */
export function MultiSessionSwitcher({
  className,
  addAccountHref = "/sign-in",
}: MultiSessionSwitcherProps) {
  const { data: session } = authClient.useSession()
  const { data: deviceSessions, isPending } = useAuthList(() =>
    authClient.multiSession.listDeviceSessions()
  )
  const [switching, setSwitching] = useState(false)

  async function switchTo(sessionToken: string) {
    setSwitching(true)
    await authClient.multiSession.setActive({ sessionToken })
    setSwitching(false)
  }

  if (isPending) {
    return <Skeleton className={cn("h-10 w-56 rounded-md", className)} />
  }

  const others = deviceSessions?.filter((d) => d.session.id !== session?.session.id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={switching}
          className={cn("h-auto justify-between gap-2 px-2 py-1.5", className)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar
              name={session?.user.name}
              email={session?.user.email}
              image={session?.user.image}
            />
            <span className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm leading-tight font-medium">
                {session?.user.name}
              </span>
              <span className="truncate text-xs leading-tight text-muted-foreground">
                {session?.user.email}
              </span>
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Accounts</DropdownMenuLabel>

        <DropdownMenuItem className="gap-2" disabled>
          <UserAvatar
            name={session?.user.name}
            email={session?.user.email}
            image={session?.user.image}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm">{session?.user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{session?.user.email}</span>
          </span>
          <Check className="size-4" />
        </DropdownMenuItem>

        {others?.map((d) => (
          <DropdownMenuItem
            key={d.session.id}
            onClick={() => switchTo(d.session.token)}
            className="gap-2"
          >
            <UserAvatar name={d.user.name} email={d.user.email} image={d.user.image} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm">{d.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{d.user.email}</span>
            </span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2">
          <Link href={addAccountHref}>
            <span className="flex size-6 items-center justify-center rounded-full border border-dashed">
              <Plus className="size-3" />
            </span>
            Add account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
