import moment from "moment";

export const getTimeRangeDisplay = (isCustomDate: boolean, startTime: string, endTime: string) => {
  if (isCustomDate) {
    return `${moment(startTime).format("MMM D, h:mm A")} - ${moment(endTime).format("MMM D, h:mm A")}`;
  }

  const now = moment();
  const start = moment(startTime);
  const diffMinutes = now.diff(start, "minutes");

  if (diffMinutes >= 0 && diffMinutes < 2) return "Last 1 Minute";
  if (diffMinutes >= 2 && diffMinutes < 16) return "Last 15 Minutes";
  if (diffMinutes >= 16 && diffMinutes < 61) return "Last Hour";

  const diffHours = now.diff(start, "hours");
  if (diffHours >= 1 && diffHours < 5) return "Last 4 Hours";
  if (diffHours >= 5 && diffHours < 25) return "Last 24 Hours";
  if (diffHours >= 25 && diffHours < 169) return "Last 7 Days";
  return `${start.format("MMM D")} - ${now.format("MMM D")}`;
};

export const formatRelativeTime = (timestamp: string): string => {
  const now = moment();
  const time = moment(timestamp);
  const diffSeconds = now.diff(time, "seconds");

  if (diffSeconds < 60) return "just now";

  const diffMinutes = now.diff(time, "minutes");
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = now.diff(time, "hours");
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = now.diff(time, "days");
  if (diffDays < 7) return `${diffDays}d ago`;

  return time.format("MMM D, h:mm A");
};

export const formatCost = (cost: number): string => {
  if (cost === 0) return "$0.00";
  if (cost < 0.001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
};

export const formatDuration = (durationMs: number | null | undefined): string => {
  if (!durationMs) return "—";
  const seconds = durationMs / 1000;
  if (seconds < 1) return `${durationMs}ms`;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatTokens = (tokens: number): string => {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}k`;
  return `${(tokens / 1000000).toFixed(1)}M`;
};
