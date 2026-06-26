"use client"

import {
  DataTable,
  DataTableColumnHeader,
  DataTableColumnToggle,
  DataTableContent,
  DataTablePagination,
  DataTableRowActions,
  DataTableSearch,
  DataTableToolbar,
} from "@/components/data-table"
import CopyButton from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"

type User = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

const data: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "active" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "Admin", status: "active" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", role: "Viewer", status: "inactive" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "Editor", status: "active" },
  { id: "8", name: "Henry Davis", email: "henry@example.com", role: "Viewer", status: "active" },
  { id: "9", name: "Iris Chen", email: "iris@example.com", role: "Admin", status: "inactive" },
  { id: "10", name: "Jack Wilson", email: "jack@example.com", role: "Editor", status: "active" },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(r) => console.log("edit", r.original.id)}
        onDelete={(r) => console.log("delete", r.original.id)}
      />
    ),
  },
]

const code = `import {
  DataTable, DataTableContent, DataTableToolbar,
  DataTableSearch, DataTableColumnToggle,
  DataTablePagination, DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"

type User = { id: string; name: string; email: string; role: string; status: string }

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
    ),
  },
]

<DataTable
  data={users}
  columns={columns}
  search={{ enabled: true }}
  rowSelection={{ enabled: true }}
>
  <DataTableToolbar>
    <DataTableSearch />
    <DataTableColumnToggle />
  </DataTableToolbar>
  <DataTableContent />
  <DataTablePagination />
</DataTable>`

export default function DataTablePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">DataTable</h1>
        <p className="mt-1 text-muted-foreground">
          A composable table built on TanStack Table. Features search, sorting, pagination, column
          visibility, and row selection out of the box.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <div className="overflow-hidden rounded-lg border">
          <div className="p-4">
            <DataTable
              data={data}
              columns={columns}
              search={{ enabled: true }}
              rowSelection={{ enabled: true }}
            >
              <DataTableToolbar>
                <DataTableSearch />
                <DataTableColumnToggle />
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination />
            </DataTable>
          </div>
          <div className="relative border-t bg-muted/50">
            <CopyButton
              value={code}
              showLabel={false}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-7 w-7"
            />
            <pre className="overflow-x-auto p-4 pr-12 font-mono text-sm">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">DataTable props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">Prop</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["data", "TData[]", "Row data array"],
              ["columns", "ColumnDef<TData>[]", "TanStack Table column definitions"],
              ["rowSelection", "{ enabled, mode? }", 'Enable row selection. mode: "single" | "multi" (default: multi)'],
              ["rowExpansion", "{ enabled, renderSubRow }", "Enable expandable rows with a sub-row renderer"],
              ["search", "{ enabled?, mode?, columnIds? }", 'Search config. mode: "global" | "column"'],
              ["pageSize", "number", "Rows per page (default: 10)"],
              ["rowCount", "number", "Total row count for server-side pagination"],
              ["state", "DataTableControlledState", "Pass controlled state for server-driven tables"],
              ["onStateChange", "DataTableStateChangeHandlers", "Handlers for controlled state changes"],
            ].map(([prop, type, desc]) => (
              <tr key={prop} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{prop}</td>
                <td className="py-2 pr-4">{type}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Sub-components</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">Component</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["DataTableContent", "Renders the table. Accepts isLoading, emptyState, onRowClick"],
              ["DataTableToolbar", "Flex row container for toolbar actions"],
              ["DataTableSearch", "Search input wired to table context"],
              ["DataTablePagination", "Page size selector and prev/next navigation"],
              ["DataTableColumnToggle", "Dropdown to show/hide columns"],
              ["DataTableColumnHeader", "Sortable column header with asc/desc/hide dropdown"],
              ["DataTableRowActions", "Three-dot row menu with edit, delete, and custom actions"],
              ["DataTableFloatingToolbar", "Fixed bottom bar with bulk actions for selected rows"],
              ["DataTableStatusFilter", "Select dropdown for filtering by a status column"],
            ].map(([name, desc]) => (
              <tr key={name} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{name}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
