import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  status: "active" | "revoked";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    key: "et_prod_xxxxx",
    created: "2026-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Development API",
    key: "et_dev_xxxxx",
    created: "2026-03-20",
    status: "active",
  },
];

export function apiKeysCommand(program: Command) {
  const apiKeys = program.command("api-keys").description("Manage API keys");

  apiKeys
    .command("list")
    .description("List all API keys")
    .action(async () => {
      const spinner = ora("Fetching API keys...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== API Keys ===\n"));
      mockApiKeys.forEach((key) => {
        const statusColor = key.status === "active" ? chalk.green : chalk.red;
        console.log(`${chalk.gray(key.id)}. ${key.name}`);
        console.log(`   ${chalk.gray("Key:")} ${key.key}`);
        console.log(
          `   ${chalk.gray("Created:")} ${key.created} ${statusColor(`[${key.status}]`)}`
        );
        console.log();
      });
    });

  apiKeys
    .command("create")
    .description("Create a new API key")
    .argument("<name>", "Name for the API key")
    .action(async (name) => {
      const spinner = ora("Creating API key...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`API key created: ${name}`));
      console.log(chalk.gray("Key: et_xxxxxxxxxxxxx"));
    });

  apiKeys
    .command("revoke")
    .description("Revoke an API key")
    .argument("<id>", "API key ID")
    .action(async (id) => {
      const spinner = ora("Revoking API key...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`API key ${id} revoked`));
    });

  apiKeys
    .command("view")
    .description("View API key details")
    .argument("<id>", "API key ID")
    .action(async (id) => {
      const spinner = ora("Fetching API key...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      const key = mockApiKeys.find((k) => k.id === id);
      if (key) {
        console.log(chalk.green(`\nName: ${key.name}`));
        console.log(chalk.gray(`Key: ${key.key}`));
        console.log(chalk.gray(`Created: ${key.created}`));
        console.log(chalk.gray(`Status: ${key.status}`));
      } else {
        console.log(chalk.red(`API key not found: ${id}`));
      }
    });
}
