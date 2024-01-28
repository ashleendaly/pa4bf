"use client";
import { DataTable } from "~/components/data-table";
import { data } from "./data";
import { columns } from "./tasks-columns";

export function TasksTab({
  taskData,
}: {
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
      <DataTable columns={columns} data={taskData} />
    </div>
  );
}
