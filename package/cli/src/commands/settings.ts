import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Setting {
  key: string;
  value: string;
  description: string;
}

const mockSettings: Setting[] = [
  { key: "site_name", value: "Etheria Times", description: "Site name" },
  { key: "site_url", value: "https://etheriatimes.com", description: "Site URL" },
  { key: "timezone", value: "Europe/Paris", description: "Timezone" },
  { key: "language", value: "fr", description: "Default language" },
];

export function settingsCommand(program: Command) {
  const settings = program.command("settings").description("Manage settings");

  settings
    .command("view")
    .description("View all settings")
    .action(async () => {
      const spinner = ora("Fetching settings...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Settings ===\n"));
      mockSettings.forEach((s) => {
        console.log(`${chalk.cyan(s.key)}: ${s.value} ${chalk.gray(`(${s.description})`)}`);
      });
    });

  settings
    .command("update")
    .description("Update a setting")
    .argument("<key>", "Setting key")
    .argument("<value>", "New value")
    .action(async (key, value) => {
      const spinner = ora("Updating setting...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Setting ${key} updated to: ${value}`));
    });

  settings
    .command("reset")
    .description("Reset all settings to default")
    .action(async () => {
      const spinner = ora("Resetting settings...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green("Settings reset to defaults"));
    });
}
