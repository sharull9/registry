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
import { Check, ChevronsUpDown, Plus } from "lucide-react"

type Account = { initials: string; name: string; email: string; active?: boolean }

function MultiSessionPreview({ accounts }: { accounts: Account[] }) {
  const active = accounts.find((a) => a.active) ?? accounts[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-auto justify-between gap-2 px-2 py-1.5">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={undefined} />
              <AvatarFallback>{active.initials}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm leading-tight font-medium">{active.name}</span>
              <span className="truncate text-xs leading-tight text-muted-foreground">
                {active.email}
              </span>
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Accounts</DropdownMenuLabel>
        {accounts.map((a) => (
          <DropdownMenuItem key={a.email} className="gap-2" disabled={a.active}>
            <Avatar size="sm">
              <AvatarFallback>{a.initials}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm">{a.name}</span>
              <span className="truncate text-xs text-muted-foreground">{a.email}</span>
            </span>
            {a.active && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <span className="flex size-6 items-center justify-center rounded-full border border-dashed">
            <Plus className="size-3" />
          </span>
          Add account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const defaultAccounts: Account[] = [
  { initials: "J", name: "Jane Smith", email: "jane@example.com", active: true },
  { initials: "B", name: "Bob Dev", email: "bob@work.io" },
]

const singleAccount: Account[] = [
  { initials: "J", name: "Jane Smith", email: "jane@example.com", active: true },
]

const defaultCode = `import { MultiSessionSwitcher } from "@/components/auth/multi-session-switcher"

<MultiSessionSwitcher />`

const customHrefCode = `<MultiSessionSwitcher addAccountHref="/auth/sign-in" />`

export default function MultiSessionSwitcherPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">MultiSessionSwitcher</h1>
        <p className="mt-1 text-muted-foreground">
          Dropdown to switch between multiple signed-in accounts on this device,
          or add another account. Requires the Better Auth{" "}
          <code className="font-mono text-xs">multiSession</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/multi-session-switcher" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Multiple accounts</h2>
        <ComponentPreview code={defaultCode} fileName="multi-session-default.tsx">
          <MultiSessionPreview accounts={defaultAccounts} />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Single account</h2>
        <ComponentPreview code={customHrefCode} fileName="multi-session-single.tsx">
          <MultiSessionPreview accounts={singleAccount} />
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
              ["addAccountHref", "string", '"/sign-in"', "Href for the Add account link"],
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
