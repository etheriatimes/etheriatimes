#!/usr/bin/env node

import { Command } from "commander";
import { createArticleCommand } from "./commands/article.js";
import { configCommand } from "./commands/config.js";

const program = new Command();

program
  .name("etheriatimes")
  .description("Etheria Times CLI - Create, preview and publish articles")
  .version("1.0.0")
  .enablePositionalOptions(false);

createArticleCommand(program);
configCommand(program);

program.parse(process.argv);
