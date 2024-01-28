"use client";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./member-columns";

export function MembersTab({
  membersData,
}: {
  membersData: {
    userId: string;
    groupId: number;
  }[];
}) {
  return (
    <div className="mt-10">
      <DataTable columns={columns} data={membersData} />
    </div>
  );
}
