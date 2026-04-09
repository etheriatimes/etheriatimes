import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawn } from "child_process";
import { promisify } from "util";

const exec = promisify(require("child_process").exec);

export async function openEditor(initialContent: string): Promise<string | null> {
  const tempFile = join(tmpdir(), `etheriatimes-${Date.now()}.md`);

  writeFileSync(tempFile, initialContent, "utf-8");

  const editor = process.env.EDITOR || process.env.VISUAL || "nano";

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(editor, [tempFile], {
        stdio: "inherit",
        env: process.env,
      });

      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Editor exited with code ${code}`));
      });

      proc.on("error", reject);
    });

    const content = readFileSync(tempFile, "utf-8");
    unlinkSync(tempFile);

    return content;
  } catch (error) {
    if (existsSync(tempFile)) {
      unlinkSync(tempFile);
    }
    throw error;
  }
}
