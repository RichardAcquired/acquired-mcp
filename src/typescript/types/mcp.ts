export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface McpToolDefinition {
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required: string[];
    };
  };
}

export interface McpToolWithDefinition {
  definition: McpToolDefinition;
  function: (args: Record<string, unknown>) => Promise<unknown>;
} 