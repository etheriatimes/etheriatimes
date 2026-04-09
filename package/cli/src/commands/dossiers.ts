import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Dossier {
  id: string;
  name: string;
  description: string;
  articles: string[];
  created: string;
}

const mockDossiers: Dossier[] = [
  {
    id: "1",
    name: "election-2026",
    description: "Coverage of 2026 elections",
    articles: ["42", "43"],
    created: "2026-01-15",
  },
  {
    id: "2",
    name: "climate-summit",
    description: "COP 2026 coverage",
    articles: ["45", "46", "47"],
    created: "2026-03-01",
  },
];

export function dossiersCommand(program: Command) {
  const dossiers = program.command("dossiers").description("Manage dossiers");

  dossiers
    .command("list")
    .description("List all dossiers")
    .action(async () => {
      const spinner = ora("Fetching dossiers...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Dossiers ===\n"));
      mockDossiers.forEach((dossier) => {
        console.log(`${chalk.gray(dossier.id)}. ${dossier.name}`);
        console.log(`   ${dossier.description}`);
        console.log(
          `   ${chalk.cyan(dossier.articles.length.toString())} articles | ${chalk.gray(dossier.created)}`
        );
        console.log();
      });
    });

  dossiers
    .command("create")
    .description("Create a new dossier")
    .argument("<name>", "Dossier name")
    .action(async (name) => {
      const spinner = ora("Creating dossier...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`Dossier created: ${name}`));
    });

  dossiers
    .command("view")
    .description("View a dossier")
    .argument("<name>", "Dossier name")
    .action(async (name) => {
      const spinner = ora("Fetching dossier...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      const dossier = mockDossiers.find((d) => d.name === name);
      if (dossier) {
        console.log(chalk.blue(`\n=== ${dossier.name} ===`));
        console.log(chalk.gray(dossier.description));
        console.log(chalk.cyan(`\nArticles: ${dossier.articles.join(", ")}`));
      } else {
        console.log(chalk.red(`Dossier not found: ${name}`));
      }
    });

  dossiers
    .command("add-article")
    .description("Add an article to a dossier")
    .argument("<dossier>", "Dossier name")
    .argument("<article>", "Article ID")
    .action(async (dossier, article) => {
      const spinner = ora("Adding article to dossier...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Article ${article} added to dossier ${dossier}`));
    });
}
