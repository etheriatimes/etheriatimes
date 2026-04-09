import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    articleId: "42",
    author: "John Doe",
    content: "Great article!",
    status: "approved",
    created: "2026-04-09T10:00:00Z",
  },
  {
    id: "2",
    articleId: "42",
    author: "Jane Smith",
    content: "Very informative",
    status: "pending",
    created: "2026-04-09T11:00:00Z",
  },
];

export function commentsCommand(program: Command) {
  const comments = program.command("comments").description("Manage comments");

  comments
    .command("list")
    .description("List all comments")
    .option("-a, --article <id>", "Filter by article ID")
    .action(async (options) => {
      const spinner = ora("Fetching comments...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Comments ===\n"));
      mockComments.forEach((comment) => {
        if (options.article && comment.articleId !== options.article) return;
        const statusColor =
          comment.status === "approved"
            ? chalk.green
            : comment.status === "pending"
              ? chalk.yellow
              : chalk.red;
        console.log(`${chalk.gray(comment.id)}. ${comment.author} on article ${comment.articleId}`);
        console.log(`   "${comment.content}"`);
        console.log(`   Status: ${statusColor(comment.status)} | ${chalk.gray(comment.created)}`);
        console.log();
      });
    });

  comments
    .command("approve")
    .description("Approve a comment")
    .argument("<id>", "Comment ID")
    .action(async (id) => {
      const spinner = ora("Approving comment...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Comment ${id} approved`));
    });

  comments
    .command("reject")
    .description("Reject a comment")
    .argument("<id>", "Comment ID")
    .action(async (id) => {
      const spinner = ora("Rejecting comment...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Comment ${id} rejected`));
    });

  comments
    .command("delete")
    .description("Delete a comment")
    .argument("<id>", "Comment ID")
    .action(async (id) => {
      const spinner = ora("Deleting comment...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Comment ${id} deleted`));
    });
}
