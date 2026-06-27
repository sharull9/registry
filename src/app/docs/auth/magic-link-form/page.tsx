import { ComponentPreview } from "@/components/docs/component-preview"
import { InstallCommand } from "@/components/docs/install-command"
import { MagicLinkForm } from "@/components/auth/magic-link-form"

const defaultCode = `import { MagicLinkForm } from "@/components/auth/magic-link-form"

<MagicLinkForm callbackURL="/dashboard" />`

const customTitleCode = `<MagicLinkForm
  title="Welcome back"
  callbackURL="/dashboard"
/>`

export default function MagicLinkFormPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">MagicLinkForm</h1>
        <p className="mt-1 text-muted-foreground">
          Passwordless sign-in card. Emails the user a magic link and shows a
          confirmation state once sent. Requires the Better Auth{" "}
          <code className="font-mono text-xs">magicLink</code> plugin.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <InstallCommand componentName="auth/magic-link-form" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Default</h2>
        <ComponentPreview code={defaultCode} fileName="magic-link-form-default.tsx">
          <MagicLinkForm />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Custom title</h2>
        <ComponentPreview code={customTitleCode} fileName="magic-link-form-title.tsx">
          <MagicLinkForm title="Welcome back" />
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
              ["callbackURL", "string", '&quot;/&quot;', "Redirect destination after sign-in"],
              ["title", "string", '&quot;Sign in&quot;', "Card heading text"],
              ["className", "string", "—", "Extra class names on the card"],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td
                  className="py-2 pr-4 font-mono"
                  dangerouslySetInnerHTML={{ __html: def }}
                />
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
