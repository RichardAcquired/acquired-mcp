export interface Tool {
  [key: string]: unknown;
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    required?: string[];
    properties?: Record<string, unknown>;
  };
  outputSchema?: {
    type: 'object';
    properties?: Record<string, unknown>;
  };
  annotations?: Record<string, unknown>;
  function: (args: Record<string, unknown>) => Promise<unknown>;
} 