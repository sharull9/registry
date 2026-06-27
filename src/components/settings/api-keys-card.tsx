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
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { authClient } from "@/lib/auth-client"
import { Check, Copy, Key, Plus, Trash2, TriangleAlert } from "lucide-react"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card to manage personal API keys: list existing keys (masked),
 * create a new key (the secret is shown exactly once), and revoke keys.
 *
 * Requires the `apiKey` plugin on the server and `apiKeyClient()` on the auth
 * client.
 */
export function ApiKeysCard({ className }: { className?: string }) {
  const { data, isPending, refetch } = useAuthList(() => authClient.apiKey.list())
  const keys = data?.apiKeys ?? null

  const [createOpen, setCreateOpen] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isCreating, startCreate] = useTransition()
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const { copied, copy } = useCopyToClipboard()

  function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value.trim()
    setError("")
    startCreate(async () => {
      const { data, error } = await authClient.apiKey.create(name ? { name } : {})
      if (error) {
        setError(error.message ?? "Failed to create API key")
        return
      }
      setNewKey(data?.key ?? null)
      refetch()
    })
  }

  async function handleDelete(keyId: string) {
    setDeletingId(keyId)
    await authClient.apiKey.delete({ keyId })
    await refetch()
    setDeletingId(null)
  }

  function closeCreate() {
    setCreateOpen(false)
    setNewKey(null)
    setError("")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>Keys for authenticating programmatic access.</CardDescription>
        <CardAction>
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => {
              setNewKey(null)
              setCreateOpen(true)
            }}
          >
            <Plus className="size-4" />
            Create key
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {isPending ? (
          <div className="flex items-center gap-3 px-4 pb-4">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ) : !keys?.length ? (
          <p className="px-4 pb-4 text-sm text-muted-foreground">No API keys yet.</p>
        ) : (
          keys.map((key, i) => (
            <div key={key.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Key className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {key.name || "API key"}
                    {key.enabled === false && (
                      <span className="ml-2 text-xs text-muted-foreground">(disabled)</span>
                    )}
                  </p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {key.start ? `${key.start}${"•".repeat(12)}` : "••••••••"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive hover:text-destructive"
                  disabled={deletingId === key.id}
                  onClick={() => handleDelete(key.id)}
                >
                  <Trash2 className="size-4" />
                  Revoke
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => (open ? setCreateOpen(true) : closeCreate())}
      >
        <DialogContent>
          {newKey ? (
            <>
              <DialogHeader>
                <DialogTitle>API key created</DialogTitle>
                <DialogDescription>
                  Copy it now — you won&apos;t be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-4">
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-sm">{newKey}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => copy(newKey)}
                  >
                    {copied ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TriangleAlert className="size-4 shrink-0" />
                  Store this secret somewhere safe.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={closeCreate}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create an API key</DialogTitle>
                <DialogDescription>Name it so you can recognize it later.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1.5 py-4">
                <Label htmlFor="api-key-name">Name (optional)</Label>
                <Input
                  id="api-key-name"
                  ref={nameRef}
                  placeholder="e.g. Production server"
                  disabled={isCreating}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeCreate}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating…" : "Create key"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
