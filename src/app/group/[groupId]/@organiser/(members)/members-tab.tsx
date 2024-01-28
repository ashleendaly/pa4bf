"use client";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./member-columns";
import { data } from "./members_data";

export function MembersTab() {
  return <DataTable columns={columns} data={data} />;
}
