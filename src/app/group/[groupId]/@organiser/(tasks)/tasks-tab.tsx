"use client";
import { DataTable } from "~/components/data-table";
import { columns } from "./tasks-columns";
import { NewTaskForm } from "./new-task-form";
import { Separator } from "@radix-ui/react-separator";

export function TasksTab({
  taskData,
  groupId,
}: {
  groupId: number;
  taskData: {
    id: number;
    groupId: number;
    onOff: boolean;
    description: string;
    points: number;
    aiJudge: boolean | null;
  }[];
}) {
  return (
    <div className="mt-10">
      <h2 className="mb-3 text-2xl underline decoration-violet-400 underline-offset-4">
        Create a new task
      </h2>
      <NewTaskForm groupId={groupId} />
      <Separator className="my-12" />
      <DataTable columns={columns} data={taskData} />
    </div>
  );
}
