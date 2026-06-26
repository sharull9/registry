import CopyButton from "@/components/copy-button"
import { ComponentPreview } from "@/components/docs/component-preview"

const basicCode = `import CopyButton from "@/components/copy-button"

<CopyButton value="pnpm add @sharull9/registry" />`

const iconOnlyCode = `<CopyButton
  value="pnpm add @sharull9/registry"
  showLabel={false}
  variant="outline"
  size="icon"
/>`

export default function CopyButtonPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">CopyButton</h1>
        <p className="mt-1 text-muted-foreground">
          Copies text to the clipboard with icon and tooltip feedback.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={basicCode}>
          <CopyButton value="pnpm add @sharull9/registry" />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Icon only</h2>
        <ComponentPreview code={iconOnlyCode}>
          <CopyButton value="pnpm add @sharull9/registry" showLabel={false} variant="outline" size="icon" />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 pr-4 font-medium">Default</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["value", "string", "—", "Text to copy to clipboard"],
              ["showLabel", "boolean", "true", "Show or hide the text label"],
              ["copyTooltip", "string", '"Copy"', "Tooltip text before copying"],
              ["copiedTooltip", "string", '"Copied!"', "Tooltip text after copying"],
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
        <p className="text-sm text-muted-foreground">
          Also accepts all <code className="font-mono">Button</code> props.
        </p>
      </section>
    </div>
  )
}
