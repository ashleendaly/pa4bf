"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { type Member } from "./members_data";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
  },
  {
    id: "actions",
    header: ({ column }) => <div>Kick from Group</div>,
    cell: ({ row }) => {
      const deleteUser = row.original;
      return <Button /*onClick={}*/ variant="outline">Kick User</Button>;
    },
  },
];
