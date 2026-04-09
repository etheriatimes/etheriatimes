import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Subscription {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: string;
}

const mockSubscriptions: Subscription[] = [
  { id: "1", email: "user1@example.com", status: "active", subscribedAt: "2026-01-15" },
  { id: "2", email: "user2@example.com", status: "active", subscribedAt: "2026-02-20" },
  { id: "3", email: "user3@example.com", status: "unsubscribed", subscribedAt: "2026-01-10" },
];

export function subscriptionsCommand(program: Command) {
  const subscriptions = program.command("subscriptions").description("Manage subscriptions");

  subscriptions
    .command("list")
    .description("List all subscriptions")
    .action(async () => {
      const spinner = ora("Fetching subscriptions...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Subscriptions ===\n"));
      mockSubscriptions.forEach((sub) => {
        const statusColor = sub.status === "active" ? chalk.green : chalk.red;
        console.log(
          `${chalk.gray(sub.id)}. ${sub.email} - ${statusColor(sub.status)} (${chalk.gray(sub.subscribedAt)})`
        );
      });
    });

  subscriptions
    .command("add")
    .description("Add a subscriber")
    .argument("<email>", "Subscriber email")
    .action(async (email) => {
      const spinner = ora("Adding subscriber...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Subscriber added: ${email}`));
    });

  subscriptions
    .command("remove")
    .description("Remove a subscriber")
    .argument("<email>", "Subscriber email")
    .action(async (email) => {
      const spinner = ora("Removing subscriber...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Subscriber removed: ${email}`));
    });

  subscriptions
    .command("export")
    .description("Export subscription list")
    .action(async () => {
      const spinner = ora("Exporting subscriptions...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green("Subscriptions exported successfully!"));
    });
}
