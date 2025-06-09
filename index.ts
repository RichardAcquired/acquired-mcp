import { Command } from "commander";
import { registerToolsCommand } from "./commands/tools.js";
import { run } from "./mcpServer.js";

const program = new Command();

program
  .name("payment-link")
  .description("CLI for managing payment links")
  .version("1.0.0");

// Register commands
registerToolsCommand(program);

program.parse();

// Start the MCP server
run().catch(console.error); 