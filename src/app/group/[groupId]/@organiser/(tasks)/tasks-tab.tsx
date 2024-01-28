"use client";
import { DataTable } from "~/components/data-table";
import { data } from "./data";
import { columns } from "./tasks-columns";

export function TasksTab() {
  return (
    <div className="mt-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
