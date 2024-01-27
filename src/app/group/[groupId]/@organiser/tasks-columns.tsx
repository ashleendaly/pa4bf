"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type Task } from "~/server/db/schema";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "description",
    header: "description",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "groupId",
    header: "ID",
  },
  {
    id: "actions",
    header: ({ column }) => <div>c</div>,
    cell: ({ row }) => {
      const idk = row.original;
      return (
        <Button variant="destructive">
          <Trash2 />
        </Button>
      );
    },
  },
  { id: "ai", header: "AI Judged?" },
];
