"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import { InstallCommand } from "@/components/docs/install-command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Check, ChevronsUpDown, Plus, User } from "lucide-react"

function OrgSwitcherPreview({
  hidePersonal = false,
  hideCreate = false,
}: {
  hidePersonal?: boolean
  hideCreate?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-auto justify-between gap-2 px-2 py-1.5">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar size="sm" className="rounded-md">
              <AvatarFallback className="rounded-md">A</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium">Acme Inc.</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        {!hidePersonal && (
          <DropdownMenuItem className="gap-2">
            <Avatar size="sm" className="rounded-md">
              <AvatarFallback className="rounded-md">
                <User className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate">Personal account</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="gap-2">
          <Avatar size="sm" className="rounded-md">
            <AvatarFallback className="rounded-md">A</AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate">Acme Inc.</span>
          <Check className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Avatar size="sm" className="rounded-md">
            <AvatarFallback className="rounded-md">G</AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate">Globex Corp</span>
        </DropdownMenuItem>
        {!hideCreate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <span className="flex size-6 items-center justify-center rounded-md border border-dashed">
                <Plus className="size-3" />
              </span>
              Create organization
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const defaultCode = `import { OrganizationSwitcher } from "@/components/auth/organization-switcher"

<OrganizationSwitcher />`

const hidePersonalCode = `<OrganizationSwitcher hidePersonal />`

const hideCreateCode = `<OrganizationSwitcher hideCreate />`

export default function OrganizationSwitcherPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">OrganizationSwitcher</h1>
        <p className="mt-1 text-muted-foreground">
          Compact dropdown that lists the user&apos;s organizations and lets them
          switch the active one, fall back to a personal account, or create a
          new org. Requires the Better Auth{" "}
          <code className="font-mono text-xs">organization</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/organization-switcher" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Default</h2>
        <ComponentPreview code={defaultCode} fileName="org-switcher-default.tsx">
          <OrgSwitcherPreview />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Hide personal account</h2>
        <ComponentPreview code={hidePersonalCode} fileName="org-switcher-no-personal.tsx">
          <OrgSwitcherPreview hidePersonal />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Hide create action</h2>
        <ComponentPreview code={hideCreateCode} fileName="org-switcher-no-create.tsx">
          <OrgSwitcherPreview hideCreate />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pr-4 pb-2 font-medium">Prop</th>
              <th className="pr-4 pb-2 font-medium">Type</th>
              <th className="pr-4 pb-2 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["hidePersonal", "boolean", "false", 'Remove the "Personal account" option'],
              ["hideCreate", "boolean", "false", 'Remove the "Create organization" action'],
              ["className", "string", "—", "Extra class names on the trigger button"],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td className="py-2 pr-4 font-mono">{def}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
