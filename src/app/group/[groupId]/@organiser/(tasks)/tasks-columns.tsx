"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Check, LucideMoreHorizontal, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTableColumnHeader } from "~/components/ui/data-table-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Task } from "~/server/db/schema";
import { api } from "~/trpc/react";

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
      <DataTableColumnHeader
        column={column}
        className="text-foreground"
        title="AI Judge"
      />
    ),
    cell: ({
      row: {
        original: { aiJudge },
      },
    }) => (aiJudge ? <Check /> : <X />),
  },
  {
    id: "onOff",
    accessorKey: "onOff",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({
      row: {
        original: { groupId, id, onOff },
      },
    }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      const { mutateAsync: startStopAsync } =
        api.group.admin.startStopTask.useMutation();
      return (
        <Button
          onClick={() =>
            void toast.promise(
              startStopAsync({ groupId, onOff: !onOff, taskId: id }).then(() =>
                router.refresh(),
              ),
              {
                success: "Changed task status!",
                loading: "Loading...",
                error: "Something went wrong",
              },
            )
          }
        >
          {!onOff ? "Start" : "Stop"}
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-foreground"
        column={column}
        title="Actions"
      />
    ),
    cell: ({
      row: {
        original: { groupId, id },
      },
    }) => {
      const { mutateAsync: deleteTaskAsync } =
        api.group.admin.deleteTask.useMutation();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                className="flex w-full gap-2"
                variant="destructive"
                size="icon"
                onClick={() => deleteTaskAsync({ groupId, taskId: id })}
              >
                Delete
                <Trash2 className="h-4 w-4" />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
