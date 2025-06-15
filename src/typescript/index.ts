import { Command } from 'commander';
import { registerToolsCommand } from './commands/tools.js';

const program = new Command();

// Register commands
registerToolsCommand();

program.parse(process.argv); 