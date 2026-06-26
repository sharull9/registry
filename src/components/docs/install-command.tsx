"use client"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { TerminalIcon } from "lucide-react"

type InstallCommandProps = {
  componentName: string
}

export function InstallCommand({ componentName }: InstallCommandProps) {
  const command = `pnpm dlx shadcn@latest add sharull9/registry/${componentName}`
  const { copy } = useCopyToClipboard()

  return (
    <div className="dark overflow-hidden rounded-lg border">
      <CodeBlock code={command} language="bash">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon size={14} />
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton onCopy={() => copy(command)} />
          </CodeBlockActions>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
