"use client"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

type ComponentPreviewProps = {
  code: string
  className?: string
  fileName: string
  children: React.ReactNode
}

export function ComponentPreview({ code, fileName, className, children }: ComponentPreviewProps) {
  const { copy } = useCopyToClipboard()
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <div className="flex min-h-40 items-center justify-center p-8">{children}</div>
      <div className="dark">
        <CodeBlock code={code} language="tsx" showLineNumbers>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileIcon size={14} />
              <CodeBlockFilename>{fileName}</CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton onCopy={() => copy(code)} />
            </CodeBlockActions>
          </CodeBlockHeader>
        </CodeBlock>
      </div>
    </div>
  )
}
