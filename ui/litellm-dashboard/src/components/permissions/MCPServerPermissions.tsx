interface MCPServerPermissionsProps {
  mcpServers?: string[];
  mcpAccessGroups?: string[];
  mcpToolPermissions?: Record<string, string[]>;
  mcpToolsets?: string[];
  accessToken?: string | null;
}

export default function MCPServerPermissions(props: MCPServerPermissionsProps) {
  return null;
}
