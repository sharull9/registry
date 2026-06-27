"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { MailCheck } from "lucide-react"
import { useRef, useState, useTransition } from "react"

export type MagicLinkFormProps = {
  className?: string
  /** Where the magic link redirects after a successful sign in. */
  callbackURL?: string
  /** Card title. */
  title?: string
}

/**
 * Passwordless sign-in form. Emails the user a magic link and shows a
 * confirmation state once sent (Better Auth `magicLink` plugin).
 */
export function MagicLinkForm({
  className,
  callbackURL = "/",
  title = "Sign in",
}: MagicLinkFormProps) {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = emailRef.current?.value.trim()
    if (!email) return
    setError("")
    startTransition(async () => {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL,
      })
      if (error) setError(error.message ?? "Failed to send magic link")
      else setSent(true)
    })
  }

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      {sent ? (
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <MailCheck className="size-6" />
          </div>
          <div>
            <p className="font-medium">Check your email</p>
            <p className="text-sm text-muted-foreground">We sent you a magic link to sign in.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a sign-in link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="magic-link-email">Email</Label>
                <Input
                  id="magic-link-email"
                  ref={emailRef}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Sending…" : "Send magic link"}
              </Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )
}
