import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Category {
  id: string;
  name: string;
  slug: string;
  articles: number;
}

const mockCategories: Category[] = [
  { id: "1", name: "Actualités", slug: "actualites", articles: 42 },
  { id: "2", name: "Technologie", slug: "technologie", articles: 28 },
  { id: "3", name: "Culture", slug: "culture", articles: 15 },
];

export function categoriesCommand(program: Command) {
  const categories = program.command("categories").description("Manage categories");

  categories
    .command("list")
    .description("List all categories")
    .action(async () => {
      const spinner = ora("Fetching categories...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Categories ===\n"));
      mockCategories.forEach((cat) => {
        console.log(
          `${chalk.gray(cat.id)}. ${cat.name} (${cat.slug}) - ${chalk.cyan(cat.articles.toString())} articles`
        );
      });
    });

  categories
    .command("create")
    .description("Create a new category")
    .argument("<name>", "Category name")
    .action(async (name) => {
      const spinner = ora("Creating category...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Category created: ${name}`));
    });

  categories
    .command("update")
    .description("Update a category")
    .argument("<id>", "Category ID")
    .argument("<name>", "New name")
    .action(async (id, name) => {
      const spinner = ora("Updating category...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Category ${id} updated to: ${name}`));
    });

  categories
    .command("delete")
    .description("Delete a category")
    .argument("<id>", "Category ID")
    .action(async (id) => {
      const spinner = ora("Deleting category...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Category ${id} deleted`));
    });
}
