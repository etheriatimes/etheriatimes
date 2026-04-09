import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "USER_CREATED",
    user: "admin",
    timestamp: "2026-04-09T10:30:00Z",
    details: "New user created",
  },
  {
    id: "2",
    action: "ARTICLE_PUBLISHED",
    user: "editor",
    timestamp: "2026-04-09T11:45:00Z",
    details: "Article #42 published",
  },
  {
    id: "3",
    action: "SETTINGS_UPDATED",
    user: "admin",
    timestamp: "2026-04-09T12:00:00Z",
    details: "Site settings modified",
  },
];

export function auditLogsCommand(program: Command) {
  const auditLogs = program.command("audit-logs").description("Manage audit logs");

  auditLogs
    .command("list")
    .description("List all audit logs")
    .action(async () => {
      const spinner = ora("Fetching audit logs...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Audit Logs ===\n"));
      mockAuditLogs.forEach((log) => {
        console.log(`${chalk.gray(log.id)}. [${log.action}] ${log.user} - ${log.details}`);
        console.log(`   ${chalk.gray(log.timestamp)}`);
        console.log();
      });
    });

  auditLogs
    .command("filter")
    .description("Filter audit logs by criteria")
    .argument("<criteria>", "Filter criteria (e.g., action, user)")
    .action(async (criteria) => {
      const spinner = ora("Filtering audit logs...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();
      console.log(chalk.green(`Filtered by: ${criteria}`));
    });

  auditLogs
    .command("export")
    .description("Export audit logs")
    .action(async () => {
      const spinner = ora("Exporting audit logs...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green("Audit logs exported successfully!"));
    });
}
