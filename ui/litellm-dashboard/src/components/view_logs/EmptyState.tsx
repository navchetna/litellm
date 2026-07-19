import { Button } from "@/components/ui/button";

export type EmptyStateVariant = "no-logs-in-range" | "filtered-empty" | "first-time";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  timeRange?: string;
  activeFilters?: string[];
  onResetFilters?: () => void;
  onExpandTimeRange?: () => void;
}

export function EmptyState({
  variant,
  timeRange,
  activeFilters = [],
  onResetFilters,
  onExpandTimeRange
}: EmptyStateProps) {
  const variantConfig = {
    "no-logs-in-range": {
      icon: (
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "No logs in this time range",
      message: timeRange ? `No logs found in ${timeRange}` : "No logs found in the selected time range",
      action: onExpandTimeRange ? (
        <Button variant="outline" size="sm" onClick={onExpandTimeRange}>
          Expand Time Range
        </Button>
      ) : null,
    },
    "filtered-empty": {
      icon: (
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
      title: "No matching logs",
      message: activeFilters.length > 0
        ? `No logs match your current filters: ${activeFilters.join(", ")}`
        : "No logs match your current filters",
      action: onResetFilters ? (
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Reset Filters
        </Button>
      ) : null,
    },
    "first-time": {
      icon: (
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h6l-4 8" opacity={0.5} />
        </svg>
      ),
      title: "No logs yet",
      message: "Your API requests will appear here once you start using LiteLLM. Make your first request to see activity logs",
      action: null,
    },
  };

  const config = variantConfig[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">
        {config.icon}
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        {config.message}
      </p>
      {config.action && (
        <div className="mt-2">
          {config.action}
        </div>
      )}
    </div>
  );
}
