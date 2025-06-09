import { Command } from "commander";
import { registerToolsCommand } from "../commands/tools";

const program = new Command();

// Register commands
registerToolsCommand(program);

program.parse(process.argv); 