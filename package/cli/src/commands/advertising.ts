import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  budget: number;
  impressions: number;
}

const mockCampaigns: Campaign[] = [
  { id: "1", name: "Spring Sale 2026", status: "active", budget: 5000, impressions: 125000 },
  { id: "2", name: "Brand Awareness", status: "active", budget: 3000, impressions: 85000 },
];

export function advertisingCommand(program: Command) {
  const advertising = program.command("advertising").description("Manage advertising campaigns");

  advertising
    .command("campaigns")
    .description("List all campaigns")
    .action(async () => {
      const spinner = ora("Fetching campaigns...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Campaigns ===\n"));
      mockCampaigns.forEach((c) => {
        const statusColor =
          c.status === "active" ? chalk.green : c.status === "paused" ? chalk.yellow : chalk.gray;
        console.log(`${chalk.gray(c.id)}. ${c.name}`);
        console.log(
          `   Status: ${statusColor(c.status)} | Budget: ${chalk.cyan(`$${c.budget}`)} | Impressions: ${chalk.cyan(c.impressions.toString())}`
        );
        console.log();
      });
    });

  advertising
    .command("create")
    .description("Create a new campaign")
    .argument("<name>", "Campaign name")
    .action(async (name) => {
      const spinner = ora("Creating campaign...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Campaign created: ${name}`));
    });

  advertising
    .command("stats")
    .description("View advertising statistics")
    .action(async () => {
      const spinner = ora("Fetching stats...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Advertising Stats ===\n"));
      console.log(`Total Spend: ${chalk.cyan("$8,000")}`);
      console.log(`Total Impressions: ${chalk.cyan("210,000")}`);
      console.log(`Click-through Rate: ${chalk.cyan("2.4%")}`);
      console.log(`Active Campaigns: ${chalk.green("2")}`);
    });
}
