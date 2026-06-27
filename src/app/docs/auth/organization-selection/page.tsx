import { OrganizationSelection } from "@/components/auth/organization-selection"
import { ComponentPreview } from "@/components/docs/component-preview"
import { InstallCommand } from "@/components/docs/install-command"

const defaultCode = `import { OrganizationSelection } from "@/components/auth/organization-selection"

export default function SelectOrgPage() {
  return <OrganizationSelection />
}`

const callbackCode = `import { useRouter } from "next/navigation"
import { OrganizationSelection } from "@/components/auth/organization-selection"

export default function SelectOrgPage() {
  const router = useRouter()

  return (
    <OrganizationSelection
      onSelected={(id) => router.push(\`/orgs/\${id}/dashboard\`)}
    />
  )
}`

export default function OrganizationSelectionPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">OrganizationSelection</h1>
        <p className="mt-1 text-muted-foreground">
          Full-page gate for org-required flows. Lists the organizations the user belongs to for
          selection, or prompts them to create one when they have none. Requires the Better Auth{" "}
          <code className="font-mono text-xs">organization</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/organization-selection" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Default</h2>
        <p className="text-sm text-muted-foreground">
          Without an active session the component shows the empty/create state.
        </p>
        <ComponentPreview code={defaultCode} fileName="org-selection-default.tsx">
          <div className="w-full max-w-md">
            <OrganizationSelection />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">With callback</h2>
        <ComponentPreview code={callbackCode} fileName="org-selection-callback.tsx">
          <div className="w-full max-w-md">
            <OrganizationSelection />
          </div>
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
              [
                "onSelected",
                "(organizationId: string) => void",
                "—",
                "Called after an org is selected or created and set active",
              ],
              ["className", "string", "—", "Extra class names on the root element"],
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
