import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Comment",
    message: "Someone commented on your article",
    read: false,
    created: "2026-04-09T10:00:00Z",
  },
  {
    id: "2",
    title: "Article Published",
    message: "Your article is now live",
    read: true,
    created: "2026-04-08T15:00:00Z",
  },
];

export function notificationsCommand(program: Command) {
  const notifications = program.command("notifications").description("Manage notifications");

  notifications
    .command("list")
    .description("List all notifications")
    .action(async () => {
      const spinner = ora("Fetching notifications...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Notifications ===\n"));
      mockNotifications.forEach((n) => {
        const readStatus = n.read ? chalk.gray("[Read]") : chalk.green("[New]");
        console.log(`${chalk.gray(n.id)}. ${readStatus} ${n.title}`);
        console.log(`   ${n.message}`);
        console.log(`   ${chalk.gray(n.created)}`);
        console.log();
      });
    });

  notifications
    .command("read")
    .description("Mark a notification as read")
    .argument("<id>", "Notification ID")
    .action(async (id) => {
      const spinner = ora("Marking as read...").start();
      await new Promise((resolve) => setTimeout(resolve, 300));
      spinner.succeed(chalk.green(`Notification ${id} marked as read`));
    });

  notifications
    .command("read-all")
    .description("Mark all notifications as read")
    .action(async () => {
      const spinner = ora("Marking all as read...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green("All notifications marked as read"));
    });

  notifications
    .command("delete")
    .description("Delete a notification")
    .argument("<id>", "Notification ID")
    .action(async (id) => {
      const spinner = ora("Deleting notification...").start();
      await new Promise((resolve) => setTimeout(resolve, 300));
      spinner.succeed(chalk.green(`Notification ${id} deleted`));
    });
}
