"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card to view and update the signed-in user's display name and
 * avatar. Self-contained — reads the session itself, so it can be dropped in
 * anywhere without a parent provider.
 */
export function ProfileCard({ className }: { className?: string }) {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)

  const ready = !sessionPending && !!session

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value.trim()
    if (!name) return
    setError("")
    startTransition(async () => {
      const { error } = await authClient.updateUser({ name })
      if (error) setError(error.message ?? "Failed to update profile")
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your display name and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {ready ? (
              <Avatar size="lg">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback>
                  {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="size-10 rounded-full" />
            )}
            <div className="text-sm">
              {ready ? (
                <>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Display name</Label>
            {ready ? (
              <Input
                id="profile-name"
                ref={nameRef}
                defaultValue={session.user.name ?? ""}
                autoComplete="name"
                disabled={isPending}
              />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="sm" className="self-start" disabled={isPending || !ready}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
