"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { PictureCard } from "./picture-card";

type Picture = { caption: string; id: number; url: string };

export const columns: ColumnDef<Picture>[] = [
  { accessorKey: "id" },
  { accessorKey: "url" },
  { accessorKey: "caption" },
];

export function PictureGrid({ data }: { data: Picture[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row) => (
            <PictureCard
              key={row.id}
              picture={row.original}
              selected={row.getIsSelected()}
            />
          ))
      ) : (
        <div>
          <div className="h-24 text-center">No results.</div>
        </div>
      )}
    </div>
  );
}
