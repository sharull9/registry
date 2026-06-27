"use client"

import { OrganizationDangerZoneCard } from "@/components/settings/organization-danger-zone-card"
import { OrganizationMembersCard } from "@/components/settings/organization-members-card"
import { OrganizationProfileCard } from "@/components/settings/organization-profile-card"
import { cn } from "@/lib/utils"

/**
 * Full organization settings UI: profile, members, and danger zone.
 *
 * Each card is exported separately
 * ({@link OrganizationProfileCard}, {@link OrganizationMembersCard},
 * {@link OrganizationDangerZoneCard}) so you can render only what you need.
 */
export function SettingsOrg({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-6", className)}>
      <OrganizationProfileCard />
      <OrganizationMembersCard />
      <OrganizationDangerZoneCard />
    </div>
  )
}
