"use client"

import { useDataTableContext } from "@/components/data-table/core/context"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

type DataTableExportProps =
  | { mode: "client"; filename?: string }
  | { mode: "server"; onExport: () => Promise<Blob | string>; filename?: string }

function triggerDownload(content: Blob | string, filename: string) {
  const blob = typeof content === "string" ? new Blob([content], { type: "text/csv" }) : content
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function buildCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => (v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v)
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n")
}

export function DataTableExport(props: DataTableExportProps) {
  const { table } = useDataTableContext()
  const [loading, setLoading] = useState(false)
  const filename = `${props.filename ?? "export"}.csv`

  const handleClient = () => {
    const visibleColumns = table
      .getVisibleLeafColumns()
      .filter((col) => !(col.columnDef.meta as { isUtilityColumn?: boolean } | undefined)?.isUtilityColumn)

    const headers = visibleColumns.map((col) => {
      const header = col.columnDef.header
      return typeof header === "string" ? header : col.id
    })

    const rows = table.getRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        const value = row.getValue(col.id)
        return value == null ? "" : String(value)
      }),
    )

    triggerDownload(buildCsv(headers, rows), filename)
  }

  const handleServer = async () => {
    if (props.mode !== "server") return
    setLoading(true)
    try {
      const result = await props.onExport()
      triggerDownload(result, filename)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      disabled={loading}
      onClick={props.mode === "client" ? handleClient : handleServer}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
      Export
    </Button>
  )
}
