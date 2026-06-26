"use client"

import {
  DataTable,
  DataTableColumnHeader,
  DataTableColumnToggle,
  DataTableContent,
  DataTableFloatingToolbar,
  DataTablePagination,
  DataTableRowActions,
  DataTableSearch,
  DataTableStatusFilter,
  DataTableToolbar,
  rowSelectionColumn,
  useDataTableUrlState,
} from "@/components/data-table"
import { ComponentPreview } from "@/components/docs/component-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Suspense, useState } from "react"
import { toast } from "sonner"

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
  { id: "11", name: "Karen Taylor", email: "karen@example.com", role: "Viewer", status: "active" },
  { id: "12", name: "Leo Anderson", email: "leo@example.com", role: "Admin", status: "active" },
  { id: "13", name: "Mia Thomas", email: "mia@example.com", role: "Editor", status: "inactive" },
  { id: "14", name: "Noah Jackson", email: "noah@example.com", role: "Viewer", status: "active" },
  { id: "15", name: "Olivia Harris", email: "olivia@example.com", role: "Admin", status: "active" },
  {
    id: "16",
    name: "Patrick Moore",
    email: "patrick@example.com",
    role: "Editor",
    status: "inactive",
  },
  { id: "17", name: "Quinn Martin", email: "quinn@example.com", role: "Viewer", status: "active" },
  { id: "18", name: "Rachel Garcia", email: "rachel@example.com", role: "Admin", status: "active" },
  { id: "19", name: "Sam Robinson", email: "sam@example.com", role: "Editor", status: "active" },
  { id: "20", name: "Tina Clark", email: "tina@example.com", role: "Viewer", status: "inactive" },
  { id: "21", name: "Umar Lewis", email: "umar@example.com", role: "Editor", status: "active" },
  { id: "22", name: "Vera Walker", email: "vera@example.com", role: "Admin", status: "active" },
  { id: "23", name: "Will Hall", email: "will@example.com", role: "Viewer", status: "active" },
  { id: "24", name: "Xena Young", email: "xena@example.com", role: "Editor", status: "inactive" },
  { id: "25", name: "Yuki Allen", email: "yuki@example.com", role: "Admin", status: "active" },
]

const columns: ColumnDef<User>[] = [
  rowSelectionColumn<User>(),
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
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.length === 0 || filterValue.includes(row.getValue(columnId)),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: (row, columnId, filterValue: string | undefined) =>
      filterValue === undefined || row.getValue(columnId) === filterValue,
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
import {
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel,
  useReactTable, type ColumnDef,
} from "@tanstack/react-table"
import { useState } from "react"

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

function MyTable() {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch />
        <DataTableColumnToggle />
      </DataTableToolbar>
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  )
}`

function BasicExample() {
  "use no memo"
  const {
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    globalFilter,
    onGlobalFilterChange,
  } = useDataTableUrlState({
    keys: { sort: "sort", page: "page", pageSize: "pageSize", search: "q" },
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [roleFilter, setRoleFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, globalFilter, columnFilters },
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch />
        <DataTableStatusFilter
          columnId="role"
          mode="multi"
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { label: "Admin", value: "Admin" },
            { label: "Editor", value: "Editor" },
            { label: "Viewer", value: "Viewer" },
          ]}
        />
        <DataTableStatusFilter
          columnId="status"
          mode="single"
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
        <DataTableColumnToggle />
      </DataTableToolbar>
      <DataTableContent />
      <DataTablePagination />
      <DataTableFloatingToolbar<User>>
        {(rows) => (
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={() =>
              toast.success("Deleted Successfully", {
                description: `Deleted ${rows.length} ${rows.length === 1 ? "item" : "items"}`,
              })
            }
          >
            Delete
          </Button>
        )}
      </DataTableFloatingToolbar>
    </DataTable>
  )
}

export default function DataTablePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">DataTable</h1>
        <p className="mt-1 text-muted-foreground">
          A composable table built on TanStack Table. Create your table with{" "}
          <code className="font-mono text-sm">useReactTable()</code> and pass it in — full control
          over which features and row models you enable.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Basic</h2>
        <ComponentPreview code={code} fileName="data-table-basic.tsx">
          <Suspense>
            <BasicExample />
          </Suspense>
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">DataTable props</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pr-4 pb-2 font-medium">Prop</th>
              <th className="pr-4 pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["table", "Table<TData>", "TanStack table instance from useReactTable()"],
              ["className", "string", "Optional wrapper class"],
              ["children", "ReactNode", "Composable children: toolbar, content, pagination"],
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
              <th className="pr-4 pb-2 font-medium">Component</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["DataTableContent", "Renders the table. Accepts isLoading, emptyState, onRowClick"],
              ["DataTableToolbar", "Flex row container for toolbar actions"],
              ["DataTableSearch", "Search input wired to table.getState().globalFilter"],
              ["DataTablePagination", "Page size selector and prev/next navigation"],
              ["DataTableColumnToggle", "Dropdown to show/hide columns"],
              ["DataTableColumnHeader", "Sortable column header with asc/desc/hide dropdown"],
              ["DataTableRowActions", "Three-dot row menu with edit, delete, and custom actions"],
              ["DataTableFloatingToolbar", "Fixed bottom bar with bulk actions for selected rows"],
              [
                "DataTableStatusFilter",
                'Select/multi-dropdown for filtering. mode: "single" | "multi"',
              ],
              [
                "DataTableFacetedFilter",
                "Multi-select filter showing value counts from the dataset",
              ],
              ["DataTableDateRangeFilter", "Date range picker wired to a column filter"],
              [
                "DataTableNumberRangeFilter",
                "Min/max numeric range filter wired to a column filter",
              ],
              ["DataTableSavedViews", "Save and restore named table states to localStorage"],
              ["DataTableDensityToggle", "Toggle compact / default / comfortable row density"],
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
