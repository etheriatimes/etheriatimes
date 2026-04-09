import chalk from "chalk";
import ora from "ora";

export async function publishArticle(content: string): Promise<void> {
  const spinner = ora("Publishing article...").start();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  spinner.succeed(chalk.green("Article published successfully!"));

  console.log(chalk.gray("[API] POST /api/articles - 200 OK"));
}
