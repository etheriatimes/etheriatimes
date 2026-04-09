import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";

const CONFIG_FILE = join(homedir(), ".etheriatimesrc");

function ensureConfigDir() {
  const dir = dirname(CONFIG_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function readConfig(): Promise<Record<string, string>> {
  ensureConfigDir();
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const content = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function writeConfig(key: string, value: string): Promise<void> {
  ensureConfigDir();
  const config = await readConfig();
  config[key] = value;
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export async function getConfigValue(key: string): Promise<string | null> {
  const config = await readConfig();
  return config[key] || null;
}
