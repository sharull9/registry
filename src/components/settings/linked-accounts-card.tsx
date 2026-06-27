"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthList } from "@/hooks/use-auth-list"
import { authClient } from "@/lib/auth-client"
import { Globe } from "lucide-react"

/**
 * Standalone card listing the social / OAuth accounts linked to the user
 * (excluding the email+password credential).
 */
export function LinkedAccountsCard({ className }: { className?: string }) {
  const { data: accounts, isPending } = useAuthList(() => authClient.listAccounts())

  const social = accounts?.filter((a) => a.providerId !== "credential")

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Linked accounts</CardTitle>
        <CardDescription>Social and OAuth accounts connected to your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : social && social.length > 0 ? (
          <div className="flex flex-col gap-2">
            {social.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-muted-foreground" />
                  <span className="font-medium capitalize">{account.providerId}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Connected {new Date(account.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No linked accounts yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
