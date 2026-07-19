import type { PaginatedResponse } from "./log_filter_logic";

interface LogTablePaginationProps {
  currentPage: number;
  onCurrentPageChange: (updater: number | ((prev: number) => number)) => void;
  pageSize: number;
  isLoading: boolean;
  filteredLogs: PaginatedResponse;
}

export function LogTablePagination({
  currentPage,
  onCurrentPageChange,
  pageSize,
  isLoading,
  filteredLogs,
}: LogTablePaginationProps) {
  return (
    <div className="border-t px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onCurrentPageChange((p: number) => Math.max(1, p - 1))}
          disabled={isLoading || currentPage === 1}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-700 font-medium">
          Page {isLoading ? "..." : currentPage} of{" "}
          {isLoading ? "..." : filteredLogs ? filteredLogs.total_pages : 1}
          {!isLoading && filteredLogs?.total_is_capped ? "+" : ""}
        </span>
        <button
          onClick={() => onCurrentPageChange((p: number) => Math.min(filteredLogs.total_pages || 1, p + 1))}
          disabled={isLoading || currentPage === (filteredLogs.total_pages || 1)}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>

      <span
        className="text-sm text-gray-600"
        title={
          !isLoading && filteredLogs?.total_is_capped
            ? `Showing the first ${filteredLogs.total.toLocaleString()} results. Narrow the date range or add filters to see more.`
            : undefined
        }
      >
        Showing {isLoading ? "..." : filteredLogs ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
        {isLoading ? "..." : filteredLogs ? Math.min(currentPage * pageSize, filteredLogs.total) : 0} of{" "}
        {isLoading ? "..." : filteredLogs ? filteredLogs.total.toLocaleString() : 0}
        {!isLoading && filteredLogs?.total_is_capped ? "+" : ""} results
      </span>
    </div>
  );
}
