"use client";

import { Checkbox } from "@radix-ui/react-checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table-header";
import { type Task } from "~/server/db/schema";

// TODO: add status (need to change task model in schema)
export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "groupId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points" />
    ),
  },
  {
    id: "ai",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AI Judge" />
    ),
    cell: ({
      row: {
        original: { aiJudge },
      },
    }) => (aiJudge ? <Check /> : <X />),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: () => {
      return (
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
    enableSorting: false,
  },
];
