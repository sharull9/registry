"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card to change the user's email. Sends a verification link to the
 * new address; the change applies once verified.
 */
export function ChangeEmailCard({ className }: { className?: string }) {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)

  const ready = !sessionPending && !!session

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newEmail = emailRef.current?.value.trim()
    if (!newEmail) return
    setError("")
    setSuccess(false)
    startTransition(async () => {
      const { error } = await authClient.changeEmail({
        newEmail,
        callbackURL: "/settings",
      })
      if (error) setError(error.message ?? "Failed to change email")
      else setSuccess(true)
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Email address</CardTitle>
        <CardDescription>A verification link will be sent to the new address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="change-email">Email</Label>
            {ready ? (
              <Input
                id="change-email"
                ref={emailRef}
                type="email"
                defaultValue={session.user.email ?? ""}
                autoComplete="email"
                disabled={isPending}
                required
              />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Verification email sent. Check your inbox.
            </p>
          )}

          <Button type="submit" size="sm" className="self-start" disabled={isPending || !ready}>
            {isPending ? "Sending…" : "Update email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
