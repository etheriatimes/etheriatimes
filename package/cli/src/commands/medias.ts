import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

interface Media {
  id: string;
  filename: string;
  type: "image" | "video" | "document";
  size: string;
  url: string;
  uploaded: string;
}

const mockMedias: Media[] = [
  {
    id: "1",
    filename: "hero-banner.jpg",
    type: "image",
    size: "2.5 MB",
    url: "/uploads/hero-banner.jpg",
    uploaded: "2026-04-01",
  },
  {
    id: "2",
    filename: "interview.mp4",
    type: "video",
    size: "150 MB",
    url: "/uploads/interview.mp4",
    uploaded: "2026-04-05",
  },
];

export function mediasCommand(program: Command) {
  const medias = program.command("medias").description("Manage medias");

  medias
    .command("list")
    .description("List all medias")
    .action(async () => {
      const spinner = ora("Fetching medias...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      console.log(chalk.blue("\n=== Medias ===\n"));
      mockMedias.forEach((media) => {
        const typeColor =
          media.type === "image" ? chalk.green : media.type === "video" ? chalk.blue : chalk.gray;
        console.log(`${chalk.gray(media.id)}. ${media.filename}`);
        console.log(
          `   Type: ${typeColor(media.type)} | Size: ${chalk.cyan(media.size)} | ${chalk.gray(media.uploaded)}`
        );
        console.log();
      });
    });

  medias
    .command("upload")
    .description("Upload a media file")
    .argument("<file>", "File path to upload")
    .action(async (file) => {
      const spinner = ora("Uploading media...").start();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinner.succeed(chalk.green(`Media uploaded: ${file}`));
    });

  medias
    .command("delete")
    .description("Delete a media")
    .argument("<id>", "Media ID")
    .action(async (id) => {
      const spinner = ora("Deleting media...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green(`Media ${id} deleted`));
    });

  medias
    .command("view")
    .description("View media details")
    .argument("<id>", "Media ID")
    .action(async (id) => {
      const spinner = ora("Fetching media...").start();
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.stop();

      const media = mockMedias.find((m) => m.id === id);
      if (media) {
        console.log(chalk.blue(`\n=== ${media.filename} ===`));
        console.log(chalk.gray(`URL: ${media.url}`));
        console.log(chalk.gray(`Size: ${media.size}`));
        console.log(chalk.gray(`Uploaded: ${media.uploaded}`));
      } else {
        console.log(chalk.red(`Media not found: ${id}`));
      }
    });
}
