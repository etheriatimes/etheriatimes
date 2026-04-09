import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "author" | "viewer";
  created: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@etheriatimes.com",
    name: "Admin User",
    role: "admin",
    created: "2026-01-01",
  },
  {
    id: "2",
    email: "editor@etheriatimes.com",
    name: "Editor User",
    role: "editor",
    created: "2026-01-15",
  },
  {
    id: "3",
    email: "author@etheriatimes.com",
    name: "Author User",
    role: "author",
    created: "2026-02-01",
  },
];

export function usersCommand(program: Command) {
  const users = program.command("users").description("Manage users");

  users
    .command("list")
    .description("List all users")
    .action(async () => {
      const spinner = ora("Fetching users...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Users ===\n"));
      mockUsers.forEach((user) => {
        const roleColor =
          user.role === "admin"
            ? chalk.red
            : user.role === "editor"
              ? chalk.blue
              : user.role === "author"
                ? chalk.green
                : chalk.gray;
        console.log(`${chalk.gray(user.id)}. ${user.name} (${user.email})`);
        console.log(`   Role: ${roleColor(user.role)} | ${chalk.gray(user.created)}`);
        console.log();
      });
    });

  users
    .command("create")
    .description("Create a new user")
    .argument("<email>", "User email")
    .argument("<role>", "User role (admin, editor, author, viewer)")
    .action(async (email, role) => {
      const spinner = ora("Creating user...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`User created: ${email} (${role})`));
    });

  users
    .command("update")
    .description("Update a user role")
    .argument("<id>", "User ID")
    .argument("<role>", "New role")
    .action(async (id, role) => {
      const spinner = ora("Updating user...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`User ${id} role updated to: ${role}`));
    });

  users
    .command("delete")
    .description("Delete a user")
    .argument("<id>", "User ID")
    .action(async (id) => {
      const spinner = ora("Deleting user...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`User ${id} deleted`));
    });

  users
    .command("view")
    .description("View user details")
    .argument("<id>", "User ID")
    .action(async (id) => {
      const spinner = ora("Fetching user...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        console.log(chalk.blue(`\n=== User: ${user.name} ===`));
        console.log(chalk.gray(`Email: ${user.email}`));
        console.log(chalk.gray(`Role: ${user.role}`));
        console.log(chalk.gray(`Created: ${user.created}`));
      } else {
        console.log(chalk.red(`User not found: ${id}`));
      }
    });
}
