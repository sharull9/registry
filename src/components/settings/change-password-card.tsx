"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useRef, useState, useTransition } from "react"

/**
 * Standalone card to change the user's password. On success all other sessions
 * are revoked.
 */
export function ChangePasswordCard({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const currentRef = useRef<HTMLInputElement>(null)
  const newRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const currentPassword = currentRef.current?.value
    const newPassword = newRef.current?.value
    const confirmPassword = confirmRef.current?.value
    if (!currentPassword || !newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }
    setError("")
    setSuccess(false)
    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        setError(error.message ?? "Failed to change password")
        return
      }
      setSuccess(true)
      if (currentRef.current) currentRef.current.value = ""
      if (newRef.current) newRef.current.value = ""
      if (confirmRef.current) confirmRef.current.value = ""
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Changing your password signs out all other sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              ref={currentRef}
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              ref={newRef}
              type="password"
              autoComplete="new-password"
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              ref={confirmRef}
              type="password"
              autoComplete="new-password"
              disabled={isPending}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Password updated successfully.
            </p>
          )}

          <Button type="submit" size="sm" className="self-start" disabled={isPending}>
            {isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
