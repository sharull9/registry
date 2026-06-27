"use client"

import { ChangeEmailCard } from "@/components/settings/change-email-card"
import { ProfileCard } from "@/components/settings/profile-card"
import { cn } from "@/lib/utils"

/**
 * Account settings panel: profile and email. Reusable on its own when you only
 * need the account section.
 */
export function AccountTab({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <ProfileCard />
      <ChangeEmailCard />
    </div>
  )
}
