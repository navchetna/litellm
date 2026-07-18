export interface MCPEvent {
  id?: string;
  type: string;
  timestamp: string | number;
  item_id?: string;
  sequence_number?: number;
  output_index?: number;
  delta?: any;
  arguments?: any;
  item?: {
    type?: string;
    tools?: any[];
    id?: string;
    [key: string]: any;
  };
}

export interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  server_id: string;
  server_name: string;
  alias: string;
  description: string;
  has_user_credential: boolean;
  is_byok: boolean;
}

export interface MCPToolEntry {
  id: string;
  name: string;
  description: string;
  server_id: string;
  tool_name: string;
}

export interface MCPToolset {
  id: string;
  name: string;
  tools: MCPToolEntry[];
  toolset_id: string;
  toolset_name: string;
  description: string;
}

export interface MCPUserEnvVarsStatus {
  [key: string]: any;
}
