"use client"

import { AccountTab } from "@/components/settings/account-tab"
import { SecurityTab } from "@/components/settings/security-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Shield, User } from "lucide-react"

/**
 * Full user settings UI with Account and Security tabs.
 *
 * Each tab ({@link AccountTab}, {@link SecurityTab}) and every card inside it is
 * exported separately, so you can compose only the pieces you need instead of
 * rendering the whole thing.
 */
export function SettingsUser({ className }: { className?: string }) {
  return (
    <Tabs defaultValue="account" className={cn("w-full", className)}>
      <TabsList className="mb-6">
        <TabsTrigger value="account">
          <User className="size-4" />
          Account
        </TabsTrigger>
        <TabsTrigger value="security">
          <Shield className="size-4" />
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <AccountTab />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  )
}
