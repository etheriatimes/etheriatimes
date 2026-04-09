import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface ScheduledPublication {
  id: string;
  articleId: string;
  title: string;
  scheduledAt: string;
}

const mockScheduled: ScheduledPublication[] = [
  {
    id: "1",
    articleId: "43",
    title: "Analysis: Future of Tech",
    scheduledAt: "2026-04-15T09:00:00Z",
  },
  { id: "2", articleId: "44", title: "Interview with CEO", scheduledAt: "2026-04-20T14:00:00Z" },
];

export function schedulingCommand(program: Command) {
  const scheduling = program.command("scheduling").description("Manage scheduled publications");

  scheduling
    .command("list")
    .description("List all scheduled publications")
    .action(async () => {
      const spinner = ora("Fetching scheduled publications...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Scheduled Publications ===\n"));
      mockScheduled.forEach((s) => {
        console.log(`${chalk.gray(s.id)}. ${s.title}`);
        console.log(`   Article: ${s.articleId} | Scheduled: ${chalk.cyan(s.scheduledAt)}`);
        console.log();
      });
    });

  scheduling
    .command("add")
    .description("Add a scheduled publication")
    .argument("<article>", "Article ID")
    .argument("<date>", "Publication date (ISO format)")
    .action(async (article, date) => {
      const spinner = ora("Scheduling publication...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Article ${article} scheduled for ${date}`));
    });

  scheduling
    .command("remove")
    .description("Remove a scheduled publication")
    .argument("<id>", "Scheduled publication ID")
    .action(async (id) => {
      const spinner = ora("Removing scheduled publication...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Scheduled publication ${id} removed`));
    });

  scheduling
    .command("update")
    .description("Update a scheduled publication")
    .argument("<id>", "Scheduled publication ID")
    .argument("<date>", "New date (ISO format)")
    .action(async (id, date) => {
      const spinner = ora("Updating scheduled publication...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Scheduled publication ${id} updated to ${date}`));
    });
}
