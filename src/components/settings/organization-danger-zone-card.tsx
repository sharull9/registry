"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { LogOut, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"

/**
 * Standalone danger-zone card for the active organization. Owners can delete the
 * org (with name confirmation); non-owners can leave it.
 */
export function OrganizationDangerZoneCard({ className }: { className?: string }) {
  const { data: session } = authClient.useSession()
  const { data: org, isPending } = useAuthList(() => authClient.organization.getFullOrganization())

  const [leaveOpen, setLeaveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [working, startWork] = useTransition()

  const isOwner = org?.members.some((m) => m.userId === session?.user.id && m.role === "owner")

  function handleLeave() {
    if (!org) return
    startWork(async () => {
      await authClient.organization.leave({ organizationId: org.id })
      setLeaveOpen(false)
    })
  }

  function handleDelete() {
    if (!org || confirm !== org.name) return
    startWork(async () => {
      await authClient.organization.delete({ organizationId: org.id })
      setDeleteOpen(false)
    })
  }

  if (isPending) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-destructive/40 ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>Irreversible actions for this org.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!isOwner && (
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Leave organization</p>
              <p className="text-xs text-muted-foreground">
                You will lose access to all resources.
              </p>
            </div>
            <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!org}>
                  <LogOut className="size-4" />
                  Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave organization?</DialogTitle>
                  <DialogDescription>
                    You will immediately lose access to <strong>{org?.name}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" disabled={working} onClick={handleLeave}>
                    {working ? "Leaving…" : "Leave"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {isOwner && (
          <div className="flex items-center justify-between rounded-lg border border-destructive/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-destructive">Delete organization</p>
              <p className="text-xs text-muted-foreground">
                Permanently deletes the org and all its data.
              </p>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={!org}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete organization?</DialogTitle>
                  <DialogDescription>
                    This cannot be undone. Type <strong>{org?.name}</strong> to confirm.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={org?.name}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteOpen(false)
                      setConfirm("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={working || confirm !== org?.name}
                    onClick={handleDelete}
                  >
                    {working ? "Deleting…" : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
