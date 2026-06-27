"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { Laptop, LogOut, Monitor, Smartphone, Trash2 } from "lucide-react"
import { useState } from "react"

function deviceIcon(userAgent?: string | null) {
  const ua = (userAgent ?? "").toLowerCase()
  if (!ua) return <Monitor className="size-4" />
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone"))
    return <Smartphone className="size-4" />
  return <Laptop className="size-4" />
}

function deviceName(userAgent?: string | null) {
  if (!userAgent) return "Unknown device"
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/)?.[1] ?? "Browser"
  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac")
      ? "Mac"
      : userAgent.includes("Linux")
        ? "Linux"
        : userAgent.includes("Android")
          ? "Android"
          : /iPhone|iPad/.test(userAgent)
            ? "iOS"
            : ""
  return os ? `${browser} on ${os}` : browser
}

/**
 * Standalone card listing the user's active sessions across devices, with a
 * revoke control for each and sign-out for the current one.
 */
export function SessionsCard({ className }: { className?: string }) {
  const { data: session } = authClient.useSession()
  const { data: sessions, isPending } = useAuthList(() => authClient.listSessions())
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revoked, setRevoked] = useState<string[]>([])

  async function revoke(token: string) {
    setRevoking(token)
    await authClient.revokeSession({ token })
    setRevoked((prev) => [...prev, token])
    setRevoking(null)
  }

  const visible = sessions
    ?.filter((s) => !revoked.includes(s.token))
    .sort((a, b) => (a.id === session?.session.id ? -1 : b.id === session?.session.id ? 1 : 0))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Active sessions</CardTitle>
        <CardDescription>Devices currently signed in to your account.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isPending || !visible ? (
          <div className="flex flex-col gap-4 px-4 pb-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          visible.map((s, i) => {
            const isCurrent = s.id === session?.session.id
            return (
              <div key={s.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      {deviceIcon(s.userAgent)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {deviceName(s.userAgent)}
                        {isCurrent && (
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.ipAddress || "Unknown IP"} · {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={revoking === s.token}
                      onClick={() => revoke(s.token)}
                    >
                      <Trash2 className="size-4" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
