import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  connected: string;
}

const mockSocialAccounts: SocialAccount[] = [
  {
    id: "1",
    platform: "twitter",
    username: "@etheriatimes",
    followers: 15000,
    connected: "2026-01-01",
  },
  {
    id: "2",
    platform: "facebook",
    username: "EtheriaTimes",
    followers: 25000,
    connected: "2026-01-15",
  },
];

export function socialAccountsCommand(program: Command) {
  const socialAccounts = program.command("social-accounts").description("Manage social accounts");

  socialAccounts
    .command("list")
    .description("List all social accounts")
    .action(async () => {
      const spinner = ora("Fetching social accounts...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Social Accounts ===\n"));
      mockSocialAccounts.forEach((account) => {
        console.log(
          `${chalk.gray(account.id)}. ${chalk.cyan(account.platform)}: ${account.username}`
        );
        console.log(
          `   Followers: ${chalk.green(account.followers.toString())} | Connected: ${chalk.gray(account.connected)}`
        );
        console.log();
      });
    });

  socialAccounts
    .command("add")
    .description("Add a social account")
    .argument("<platform>", "Platform to add")
    .action(async (platform) => {
      const spinner = ora("Adding social account...").start();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinner.succeed(chalk.green(`Social account added: ${platform}`));
    });

  socialAccounts
    .command("remove")
    .description("Remove a social account")
    .argument("<id>", "Account ID")
    .action(async (id) => {
      const spinner = ora("Removing social account...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Social account ${id} removed`));
    });
}
