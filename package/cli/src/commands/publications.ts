import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Publication {
  id: string;
  articleId: string;
  title: string;
  status: "published" | "scheduled" | "draft";
  publishedAt?: string;
  scheduledAt?: string;
}

const mockPublications: Publication[] = [
  {
    id: "1",
    articleId: "42",
    title: "Breaking News",
    status: "published",
    publishedAt: "2026-04-09T10:00:00Z",
  },
  {
    id: "2",
    articleId: "43",
    title: "Analysis: Future of Tech",
    status: "scheduled",
    scheduledAt: "2026-04-15T09:00:00Z",
  },
];

export function publicationsCommand(program: Command) {
  const publications = program.command("publications").description("Manage publications");

  publications
    .command("list")
    .description("List all publications")
    .action(async () => {
      const spinner = ora("Fetching publications...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Publications ===\n"));
      mockPublications.forEach((pub) => {
        const statusColor =
          pub.status === "published"
            ? chalk.green
            : pub.status === "scheduled"
              ? chalk.yellow
              : chalk.gray;
        console.log(`${chalk.gray(pub.id)}. ${pub.title}`);
        console.log(`   Article: ${pub.articleId} | Status: ${statusColor(pub.status)}`);
        if (pub.publishedAt) console.log(`   Published: ${chalk.gray(pub.publishedAt)}`);
        if (pub.scheduledAt) console.log(`   Scheduled: ${chalk.cyan(pub.scheduledAt)}`);
        console.log();
      });
    });

  publications
    .command("schedule")
    .description("Schedule a publication")
    .argument("<article>", "Article ID")
    .action(async (article) => {
      const spinner = ora("Scheduling publication...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Article ${article} scheduled for publication`));
    });

  publications
    .command("publish")
    .description("Publish immediately")
    .argument("<article>", "Article ID")
    .action(async (article) => {
      const spinner = ora("Publishing...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Article ${article} published!`));
    });

  publications
    .command("cancel")
    .description("Cancel a scheduled publication")
    .argument("<id>", "Publication ID")
    .action(async (id) => {
      const spinner = ora("Cancelling publication...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Publication ${id} cancelled`));
    });
}
