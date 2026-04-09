import { readFileSync, writeFileSync, existsSync } from "fs";
import { createServer } from "http";
import { resolve } from "path";
import { marked } from "marked";
import open from "open";
import chalk from "chalk";

const HTML_TEMPLATE = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Etheria Times</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 1em; overflow-x: auto; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

export async function previewMarkdown(contentOrFile: string, isFilePath = false): Promise<void> {
  let htmlContent: string;

  if (isFilePath) {
    const filePath = resolve(contentOrFile);
    if (!existsSync(filePath)) {
      console.log(chalk.red(`File not found: ${contentOrFile}`));
      process.exit(1);
    }
    const markdown = readFileSync(filePath, "utf-8");
    htmlContent = await marked.parse(markdown);
  } else {
    htmlContent = await marked.parse(contentOrFile);
  }

  const html = HTML_TEMPLATE(htmlContent);

  const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });

  await new Promise<void>((resolve) => {
    server.listen(3000, () => resolve());
  });

  console.log(chalk.blue("Preview server running at http://localhost:3000"));
  await open("http://localhost:3000");

  console.log(chalk.yellow("Press Ctrl+C to stop the server"));
}
