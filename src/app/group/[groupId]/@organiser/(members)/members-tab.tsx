"use client";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./member-columns";
import { data } from "./members_data";
import { api } from "~/trpc/react";

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
