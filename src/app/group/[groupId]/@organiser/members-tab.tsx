import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { data } from "./data";

export function MembersTab() {
  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
