import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Link {
  id: string;
  shortcode: string;
  url: string;
  clicks: number;
  created: string;
}

const mockLinks: Link[] = [
  {
    id: "1",
    shortcode: "abc123",
    url: "https://etheriatimes.com/article/42",
    clicks: 1250,
    created: "2026-04-01",
  },
  {
    id: "2",
    shortcode: "xyz789",
    url: "https://etheriatimes.com/article/43",
    clicks: 890,
    created: "2026-04-05",
  },
];

export function linkerCommand(program: Command) {
  const linker = program.command("linker").description("Manage shortened links");

  linker
    .command("list")
    .description("List all shortened links")
    .action(async () => {
      const spinner = ora("Fetching links...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Shortened Links ===\n"));
      mockLinks.forEach((link) => {
        console.log(`${chalk.gray(link.id)}. ${chalk.cyan(`https://et.io/${link.shortcode}`)}`);
        console.log(`   ${link.url}`);
        console.log(
          `   ${chalk.green(link.clicks.toString())} clicks | ${chalk.gray(link.created)}`
        );
        console.log();
      });
    });

  linker
    .command("create")
    .description("Create a shortened link")
    .argument("<url>", "URL to shorten")
    .action(async (url) => {
      const spinner = ora("Creating shortened link...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green("Link created!"));
      console.log(chalk.cyan(`Short URL: https://et.io/abc123`));
    });

  linker
    .command("stats")
    .description("View link statistics")
    .argument("<shortcode>", "Short code")
    .action(async (shortcode) => {
      const spinner = ora("Fetching stats...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue(`\n=== Stats for ${shortcode} ===`));
      console.log(chalk.green(`Clicks: 1,250`));
      console.log(chalk.gray(`Created: 2026-04-01`));
    });
}
