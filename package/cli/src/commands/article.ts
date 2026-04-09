import { Command } from "commander";
import { openEditor } from "../utils/editor.js";
import { previewMarkdown } from "../utils/preview.js";
import { publishArticle } from "../utils/api.js";
import inquirer from "inquirer";
import chalk from "chalk";
import { existsSync } from "fs";
import { resolve } from "path";

export function createArticleCommand(program: Command) {
  const article = program.command("article").description("Manage articles");

  article
    .command("create")
    .description("Create a new article")
    .action(async () => {
      console.log(chalk.blue("Creating new article..."));

      const content = await openEditor("# Titre\n\nÉcris ton articleici...");

      if (!content || content.trim().length === 0) {
        console.log(chalk.yellow("Article cancelled - no content"));
        return;
      }

      const { doPreview } = await inquirer.prompt([
        {
          type: "confirm",
          name: "doPreview",
          message: "Preview article?",
          default: true,
        },
      ]);

      if (doPreview) {
        await previewMarkdown(content);
      }

      const { doPublish } = await inquirer.prompt([
        {
          type: "confirm",
          name: "doPublish",
          message: "Publish article?",
          default: false,
        },
      ]);

      if (doPublish) {
        await publishArticle(content);
      }
    });

  article
    .command("preview")
    .description("Preview an existing markdown file")
    .argument("<file>", "Markdown file to preview")
    .action(async (file) => {
      const filePath = resolve(file);
      if (!existsSync(filePath)) {
        console.log(chalk.red(`File not found: ${file}`));
        process.exit(1);
      }
      await previewMarkdown(filePath, true);
    });
}
