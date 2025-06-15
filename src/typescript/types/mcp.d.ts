declare module '@modelcontextprotocol/sdk' {
  export class MCPServer {
    constructor(config: {
      name: string;
      version: string;
      description: string;
      functions: Record<string, (params: any) => Promise<any>>;
    });
    start(): void;
  }
} 