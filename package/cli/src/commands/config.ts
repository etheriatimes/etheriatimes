import { Command } from "commander";
import { readConfig, writeConfig, getConfigValue } from "../utils/config.js";
import chalk from "chalk";

export function configCommand(program: Command) {
  const config = program.command("config").description("Manage configuration");

  config
    .command("set")
    .description("Set a config value")
    .argument("<key>", "Config key")
    .argument("<value>", "Config value")
    .action(async (key, value) => {
      await writeConfig(key, value);
      console.log(chalk.green(`Config set: ${key} = ${value}`));
    });

  config
    .command("get")
    .description("Get a config value")
    .argument("<key>", "Config key")
    .action(async (key) => {
      const value = await getConfigValue(key);
      if (value === null) {
        console.log(chalk.yellow(`Config not found: ${key}`));
      } else {
        console.log(value);
      }
    });
}
