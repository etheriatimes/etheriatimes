import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Newsletter {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  sentAt?: string;
  recipients: number;
}

const mockNewsletters: Newsletter[] = [
  {
    id: "1",
    name: "Weekly Digest",
    subject: "This week's top stories",
    status: "sent",
    sentAt: "2026-04-07",
    recipients: 5200,
  },
  {
    id: "2",
    name: "Special Edition",
    subject: "Breaking: Major event",
    status: "scheduled",
    recipients: 0,
  },
];

export function newsletterCommand(program: Command) {
  const newsletter = program.command("newsletter").description("Manage newsletters");

  newsletter
    .command("list")
    .description("List all newsletters")
    .action(async () => {
      const spinner = ora("Fetching newsletters...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Newsletters ===\n"));
      mockNewsletters.forEach((nl) => {
        const statusColor =
          nl.status === "sent"
            ? chalk.green
            : nl.status === "scheduled"
              ? chalk.yellow
              : chalk.gray;
        console.log(`${chalk.gray(nl.id)}. ${nl.name}`);
        console.log(`   Subject: "${nl.subject}"`);
        console.log(
          `   Status: ${statusColor(nl.status)} | Recipients: ${chalk.cyan(nl.recipients.toString())}`
        );
        console.log();
      });
    });

  newsletter
    .command("send")
    .description("Send a newsletter")
    .argument("<id>", "Newsletter ID")
    .action(async (id) => {
      const spinner = ora("Sending newsletter...").start();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinner.succeed(chalk.green(`Newsletter ${id} sent!`));
    });

  newsletter
    .command("create")
    .description("Create a new newsletter")
    .argument("<name>", "Newsletter name")
    .action(async (name) => {
      const spinner = ora("Creating newsletter...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Newsletter created: ${name}`));
    });

  newsletter
    .command("stats")
    .description("View newsletter statistics")
    .argument("<id>", "Newsletter ID")
    .action(async (id) => {
      const spinner = ora("Fetching stats...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue(`\n=== Newsletter ${id} Stats ===`));
      console.log(chalk.green("Sent: 5,200"));
      console.log(chalk.green("Opened: 2,100"));
      console.log(chalk.green("Clicked: 450"));
    });
}
