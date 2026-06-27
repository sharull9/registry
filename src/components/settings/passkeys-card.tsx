"use client"

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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { Fingerprint, Plus, Trash2 } from "lucide-react"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card that lists the user's passkeys and supports registering a new
 * one (via the WebAuthn prompt) and deleting existing ones.
 *
 * Requires the `passkey` plugin on the server and `passkeyClient()` on the
 * auth client.
 */
export function PasskeysCard({ className }: { className?: string }) {
  const {
    data: passkeys,
    isPending,
    refetch,
  } = useAuthList(() => authClient.passkey.listUserPasskeys())
  const [addOpen, setAddOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, startAdd] = useTransition()
  const [error, setError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value.trim()
    setError("")
    startAdd(async () => {
      const res = await authClient.passkey.addPasskey(name ? { name } : undefined)
      if (res?.error) {
        setError(res.error.message ?? "Failed to add passkey")
        return
      }
      setAddOpen(false)
      refetch()
    })
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await authClient.passkey.deletePasskey({ id })
    await refetch()
    setDeletingId(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Passkeys</CardTitle>
        <CardDescription>Sign in with biometrics or a security key.</CardDescription>
        <CardAction>
          <Button size="sm" disabled={isPending} onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add passkey
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {isPending ? (
          <div className="flex items-center gap-3 px-4 pb-4">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ) : !passkeys?.length ? (
          <p className="px-4 pb-4 text-sm text-muted-foreground">
            No passkeys yet. Add one for faster, password-free sign in.
          </p>
        ) : (
          passkeys.map((passkey, i) => (
            <div key={passkey.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Fingerprint className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{passkey.name || "Passkey"}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(passkey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive hover:text-destructive"
                  disabled={deletingId === passkey.id}
                  onClick={() => handleDelete(passkey.id)}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add a passkey</DialogTitle>
              <DialogDescription>
                Give it a name, then follow your browser&apos;s prompt.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5 py-4">
              <Label htmlFor="passkey-name">Name (optional)</Label>
              <Input
                id="passkey-name"
                ref={nameRef}
                placeholder="e.g. MacBook Touch ID"
                disabled={isAdding}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? "Waiting…" : "Add passkey"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
