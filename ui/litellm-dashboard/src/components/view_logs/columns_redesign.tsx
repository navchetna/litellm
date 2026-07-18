import type { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "antd";
import React from "react";
import { getProviderLogoAndName } from "../provider_info_helpers";
import { AGENT_CALL_TYPES, MCP_CALL_TYPES } from "./constants";
import {
  formatRelativeTime,
  formatCost,
  formatDuration,
  formatTokens,
} from "./logs_utils";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  CopyOutlined,
} from "@ant-design/icons";

export const LOGS_SORT_FIELD_MAP = {
  startTime: "startTime",
  spend: "spend",
  total_tokens: "total_tokens",
  request_duration_ms: "request_duration_ms",
  model: "model",
  ttft_ms: "ttft_ms",
} as const;

export type LogsSortField = keyof typeof LOGS_SORT_FIELD_MAP;

export interface LogsSortProps {
  sortBy: LogsSortField;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: LogsSortField, sortOrder: "asc" | "desc") => void;
}

export type LogEntry = {
  request_id: string;
  api_key: string;
  team_id: string;
  model: string;
  model_id: string;
  api_base?: string;
  call_type: string;
  spend: number;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  startTime: string;
  endTime: string;
  user?: string;
  end_user?: string;
  custom_llm_provider?: string;
  metadata?: Record<string, any>;
  cache_hit: string;
  cache_key?: string;
  request_tags?: Record<string, any>;
  requester_ip_address?: string;
  messages: string | any[] | Record<string, any>;
  response: string | any[] | Record<string, any>;
  proxy_server_request?: string | any[] | Record<string, any>;
  session_id?: string;
  status?: string;
  completionStartTime?: string;
  request_duration_ms?: number;
  session_total_count?: number;
  session_total_spend?: number;
  mcp_tool_call_count?: number;
  mcp_tool_call_spend?: number;
  session_llm_count?: number;
  session_mcp_count?: number;
  session_agent_count?: number;
  onKeyHashClick?: (keyHash: string) => void;
  onSessionClick?: (sessionId: string) => void;
};

const StatusIcon = ({ status }: { status?: string }) => {
  const isSuccess = status === "success";
  return (
    <div className={`text-${isSuccess ? "green" : "red"}-500 text-lg`}>
      {isSuccess ? (
        <CheckCircleOutlined style={{ fontSize: 20, color: "#10b981" }} />
      ) : (
        <ExclamationCircleOutlined style={{ fontSize: 20, color: "#ef4444" }} />
      )}
    </div>
  );
};

const HighCostBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-medium">
    💰 HIGH COST
  </span>
);

const SlowBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-medium">
    SLOW
  </span>
);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const CardRow = ({ row }: { row: LogEntry }) => {
  const isSuccess = row.status === "success";
  const isFailure = row.status === "failure";
  const errorInfo = row.metadata?.error_information;
  const errorMessage = errorInfo?.error_message || errorInfo?.error_code;

  const provider = row.custom_llm_provider || "";
  const providerInfo = getProviderLogoAndName(provider);

  const sessionCount = row.session_total_count || 0;
  const isSession = sessionCount > 1;

  const keyAlias = row.metadata?.user_api_key_alias || "";
  const teamAlias = row.metadata?.user_api_key_team_alias || "";

  const contextInfo = row.session_id
    ? `Session: ${row.session_id.substring(0, 8)}`
    : row.end_user || row.user || keyAlias || teamAlias;

  const isHighCost = row.spend > 1;
  const isSlow = (row.request_duration_ms || 0) > 5000;

  return (
    <div
      className={`
        p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors
        ${isFailure ? "bg-red-50 border-red-200" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <StatusIcon status={row.status} />

          <div className="flex-1 min-w-0">
            {isSession ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    ▶ SESSION
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatRelativeTime(row.startTime)}
                  </span>
                </div>
                <div className="text-base font-medium text-gray-900">
                  Multi-turn conversation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{formatCost(row.session_total_spend || row.spend)} total</span>
                  <span>•</span>
                  <span>{row.session_llm_count || 0} LLM calls</span>
                  {(row.session_mcp_count || 0) > 0 && (
                    <>
                      <span>•</span>
                      <span>{row.session_mcp_count} tool calls</span>
                    </>
                  )}
                  {(row.session_agent_count || 0) > 0 && (
                    <>
                      <span>•</span>
                      <span>{row.session_agent_count} agent calls</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-gray-400">{contextInfo}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {formatRelativeTime(row.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {providerInfo.logo && (
                    <img
                      src={providerInfo.logo}
                      alt={provider}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span className="text-base font-medium text-gray-900">
                    {row.model}
                  </span>
                  <span className="text-sm text-gray-500">· {providerInfo.name || provider}</span>
                  {isHighCost && <HighCostBadge />}
                  {isSlow && <SlowBadge />}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{formatCost(row.spend)}</span>
                  <span>•</span>
                  <span>{formatDuration(row.request_duration_ms)}</span>
                  <span>•</span>
                  <span>{formatTokens(row.total_tokens)} tok</span>
                  <span>•</span>
                  <span className="text-gray-400">{contextInfo}</span>
                </div>

                {isFailure && errorMessage && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                    <span className="font-medium">Error:</span> {errorMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Tooltip title="Copy Request ID">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(row.request_id);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <CopyOutlined style={{ fontSize: 14 }} />
            </button>
          </Tooltip>
          <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1">
            Details
            <RightOutlined style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const createColumns = (sortProps?: LogsSortProps): ColumnDef<LogEntry>[] => [
  {
    id: "card",
    cell: (info: any) => <CardRow row={info.row.original} />,
  },
];
