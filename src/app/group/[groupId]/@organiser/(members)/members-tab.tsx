"use client";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./member-columns";
import { data } from "./members_data";

export function MembersTab() {
  return (
    <div className="mt-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
