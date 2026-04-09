import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Log {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  timestamp: string;
}

const mockLogs: Log[] = [
  { id: "1", level: "info", message: "Server started", timestamp: "2026-04-09T10:00:00Z" },
  { id: "2", level: "warn", message: "High memory usage", timestamp: "2026-04-09T10:30:00Z" },
  {
    id: "3",
    level: "error",
    message: "Database connection failed",
    timestamp: "2026-04-09T11:00:00Z",
  },
];

export function logsCommand(program: Command) {
  const logs = program.command("logs").description("Manage logs");

  logs
    .command("list")
    .description("List all logs")
    .action(async () => {
      const spinner = ora("Fetching logs...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Logs ===\n"));
      mockLogs.forEach((log) => {
        const levelColor =
          log.level === "info" ? chalk.blue : log.level === "warn" ? chalk.yellow : chalk.red;
        console.log(
          `${chalk.gray(log.timestamp)} ${levelColor(`[${log.level.toUpperCase()}]`)} ${log.message}`
        );
      });
    });

  logs
    .command("filter")
    .description("Filter logs by level")
    .argument("<level>", "Log level (info, warn, error)")
    .action(async (level) => {
      const spinner = ora(`Filtering by ${level}...`).start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      const filtered = mockLogs.filter((l) => l.level === level);
      filtered.forEach((log) => {
        console.log(`${chalk.gray(log.timestamp)} ${log.message}`);
      });
    });

  logs
    .command("export")
    .description("Export logs")
    .action(async () => {
      const spinner = ora("Exporting logs...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green("Logs exported successfully!"));
    });
}
