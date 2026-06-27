"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { Crown, Mail, Shield, UserMinus, UserPlus, Users } from "lucide-react"
import { useRef, useState, useTransition } from "react"

function roleMeta(role: string) {
  if (role === "owner") return { label: "Owner", icon: Crown }
  if (role === "admin") return { label: "Admin", icon: Shield }
  return { label: "Member", icon: Users }
}

/**
 * Standalone card listing organization members and pending invitations, with
 * invite, remove, and cancel-invitation controls.
 */
export function OrganizationMembersCard({ className }: { className?: string }) {
  const { data: session } = authClient.useSession()
  const {
    data: org,
    isPending,
    refetch,
  } = useAuthList(() => authClient.organization.getFullOrganization())

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviting, startInvite] = useTransition()
  const [error, setError] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const emailRef = useRef<HTMLInputElement>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = emailRef.current?.value.trim()
    if (!email) return
    setError("")
    startInvite(async () => {
      const { error } = await authClient.organization.inviteMember({
        email,
        role: inviteRole as "member" | "admin" | "owner",
      })
      if (error) {
        setError(error.message ?? "Failed to send invitation")
        return
      }
      setInviteOpen(false)
      refetch()
    })
  }

  async function removeMember(memberId: string) {
    if (!org) return
    setRemovingId(memberId)
    await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
      organizationId: org.id,
    })
    await refetch()
    setRemovingId(null)
  }

  async function cancelInvitation(invitationId: string) {
    await authClient.organization.cancelInvitation({ invitationId })
    refetch()
  }

  const pending = org?.invitations?.filter((i) => i.status === "pending") ?? []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage who has access to this org.</CardDescription>
        <CardAction>
          <Button size="sm" disabled={isPending} onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {isPending || !org ? (
          <div className="flex flex-col gap-4 px-4 pb-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {org.members.map((member, i) => {
              const { label, icon: Icon } = roleMeta(member.role)
              const isSelf = member.userId === session?.user.id
              return (
                <div key={member.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user.image ?? undefined} />
                        <AvatarFallback>
                          {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.user.name}
                          {isSelf && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Icon className="size-3" />
                        {label}
                      </Badge>
                      {!isSelf && member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          disabled={removingId === member.id}
                          onClick={() => removeMember(member.id)}
                        >
                          <UserMinus className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {pending.length > 0 && (
              <>
                <Separator />
                <p className="px-4 py-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Pending invitations
                </p>
                {pending.map((inv, i) => (
                  <div key={inv.id}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                          <Mail className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm">{inv.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Invited as {inv.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => cancelInvitation(inv.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <form onSubmit={handleInvite}>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
              <DialogDescription>
                They&apos;ll receive an email to join this organization.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  ref={emailRef}
                  type="email"
                  placeholder="teammate@example.com"
                  disabled={inviting}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={inviting}>
                {inviting ? "Sending…" : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
