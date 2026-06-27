"use client"

import { ChangePasswordCard } from "@/components/settings/change-password-card"
import { LinkedAccountsCard } from "@/components/settings/linked-accounts-card"
import { PasskeysCard } from "@/components/settings/passkeys-card"
import { SessionsCard } from "@/components/settings/sessions-card"
import { cn } from "@/lib/utils"

export type SecurityTabProps = {
  className?: string
  /** Hide the passkeys card (e.g. when the passkey plugin is not enabled). */
  hidePasskeys?: boolean
  /** Hide the linked social accounts card. */
  hideLinkedAccounts?: boolean
}

/**
 * Security settings panel: password, passkeys, active sessions and linked
 * accounts. Reusable on its own; individual cards can also be used directly.
 */
export function SecurityTab({ className, hidePasskeys, hideLinkedAccounts }: SecurityTabProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <ChangePasswordCard />
      {!hidePasskeys && <PasskeysCard />}
      <SessionsCard />
      {!hideLinkedAccounts && <LinkedAccountsCard />}
    </div>
  )
}
