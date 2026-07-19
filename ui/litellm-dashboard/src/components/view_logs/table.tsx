import { Fragment, useState } from "react";
import {
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { LogTableSkeleton } from "./LogTableSkeleton";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    numeric?: boolean;
  }
}

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  getRowId?: (row: TData, index: number) => string;
  onRowClick?: (row: TData) => void;
  /** Renders inside a single colspan cell */
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  noDataMessage?: string;
  /** Enable client-side column sorting (defaults to false to avoid conflicts with server-side sorting) */
  enableSorting?: boolean;
  /** Returns true if the row should be styled as a session row */
  isSessionRow?: (row: TData) => boolean;
  /** Index of the currently selected row for keyboard navigation */
  selectedIndex?: number;
  /** Custom empty state component to show when there's no data */
  emptyStateComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  data = [],
  columns,
  getRowId,
  onRowClick,
  renderSubComponent,
  getRowCanExpand,
  isLoading = false,
  loadingMessage = "Loading...",
  noDataMessage = "No results",
  enableSorting = false,
  isSessionRow,
  selectedIndex = -1,
  emptyStateComponent,
}: DataTableProps<TData, TValue>) {
  const supportsExpansion = !!renderSubComponent && !!getRowCanExpand;
  const hasExplicitColumnSizes = columns.some((column) => column.size !== undefined);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<TData>({
    data,
    columns,
    ...(enableSorting && {
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      enableSortingRemoval: false,
    }),
    ...(supportsExpansion && { getRowCanExpand }),
    ...(getRowId && { getRowId }),
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(supportsExpansion && { getExpandedRowModel: getExpandedRowModel() }),
  });

  const tableClassName = hasExplicitColumnSizes ? "table-fixed" : "table-fixed w-full box-border";
  const tableStyle = hasExplicitColumnSizes ? { minWidth: table.getCenterTotalSize() } : { minWidth: "400px" };

  return (
    <div className="rounded-lg custom-border overflow-hidden w-full max-w-full box-border">
      <Table className={tableClassName} style={tableStyle}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
              {headerGroup.headers.map((header) => {
                const canSort = enableSorting && header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                const numeric = header.column.columnDef.meta?.numeric;

                return (
                  <TableHead
                    key={header.id}
                    className={`py-1 h-8 text-xs font-medium text-muted-foreground first:pl-4 last:pr-4 ${
                      canSort ? "cursor-pointer select-none hover:bg-muted" : ""
                    }`}
                    style={hasExplicitColumnSizes ? { width: header.getSize() } : undefined}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className={`flex items-center gap-1 ${numeric ? "justify-end" : ""}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="text-muted-foreground">
                            {isSorted === "asc" ? "↑" : isSorted === "desc" ? "↓" : "⇅"}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LogTableSkeleton columns={columns.length} rows={5} />
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => {
              const isSession = isSessionRow?.(row.original) || false;
              const isSelected = index === selectedIndex;
              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-row-index={index}
                    className={`${
                      isSession
                        ? "bg-blue-50/30 hover:bg-blue-50/50 border-l-4 border-l-blue-400"
                        : "hover:bg-gray-50"
                    } ${
                      isSelected ? "ring-2 ring-blue-500 ring-inset bg-blue-50/20" : ""
                    } transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${isSession ? "py-4" : "py-3"} first:pl-6 last:pr-6 ${
                          cell.column.columnDef.meta?.numeric ? "text-right tabular-nums" : ""
                        }`}
                        style={hasExplicitColumnSizes ? { width: cell.column.getSize() } : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  {supportsExpansion && row.getIsExpanded() && renderSubComponent && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                        <div className="w-full max-w-full overflow-hidden box-border">{renderSubComponent({ row })}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="text-center align-middle p-0">
                {emptyStateComponent || (
                  <p className="text-sm text-muted-foreground py-24">{noDataMessage}</p>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
