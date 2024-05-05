/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Store } from "@/db/schema";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import StoreListDataTable from "./store-list-data-table";
import NoResultMessage from "@/components/no-result-message";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  stores: Store[];
}

const storesHelper = createColumnHelper<Store>();

export default function StoreListShellTables({ stores }: Props) {
  const path = usePathname();
  const [rowSelection, setRowSelection] = useState({});
  const [rawRowDataSelection, setRawRowDataSelection] = useState<Store[]>([]);
  const columns = useMemo(
    () =>
      [
        storesHelper.accessor("id", {
          header: ({ table }) => (
            <div className="py-1">
              <Checkbox
                checked={table.getIsAllRowsSelected()}
                onClick={table.getToggleAllRowsSelectedHandler()}
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="py-1">
              <Checkbox
                checked={row.getIsSelected()}
                onClick={row.getToggleSelectedHandler()}
                disabled={!row.getCanSelect()}
              />
            </div>
          ),
        }),
        storesHelper.accessor("name", {
          header: () => "Name",
          cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
          ),
          footer: (info) => info.column.id,
        }),
        storesHelper.accessor("active", {
          header: () => "Status",
          cell: (info) => (
            <span className="font-medium">
              {info.getValue() ? (
                <Badge className="border-green-300 bg-green-200 text-green-500">
                  Active
                </Badge>
              ) : (
                <Badge className="border-destructive/40 bg-destructive/20 text-destructive/60">
                  Not Active
                </Badge>
              )}
            </span>
          ),
          footer: (info) => info.column.id,
        }),
        storesHelper.accessor("slug", {
          header: () => "Store Slug",
          cell: (info) => (
            <span className="font-medium">{info.getValue()}</span>
          ),
          footer: (info) => info.column.id,
        }),
        storesHelper.accessor("createdAt", {
          header: () => "Created",
          cell: (info) => (
            <span className="font-medium">
              {formatDate(info.getValue() as Date)}
            </span>
          ),
          footer: (info) => info.column.id,
        }),
      ] as ColumnDef<Store>[],
    [path],
  );

  return (
    <div>
      {stores.length > 0 ? (
        <StoreListDataTable
          columns={columns}
          data={stores}
          rawRowDataSelection={rawRowDataSelection}
          rowSelection={rowSelection}
          setRawRowData={setRawRowDataSelection}
          setRowSelection={setRowSelection}
        />
      ) : (
        <NoResultMessage />
      )}
    </div>
  );
}
