import { DataTable } from "~/components/data-table";
import { data } from "./data";
import { columns } from "./tasks-columns";

export function TasksTab() {
  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
