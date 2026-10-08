import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const importLine = '@import "tailwindcss";';
const pluginLine = '@plugin "@tailwindcss/typography";';

export async function addTypographyPlugin(projectDir: string): Promise<void> {
  const cssPath = join(projectDir, "app", "globals.css");
  const css = await readFile(cssPath, "utf8");
  if (css.includes(pluginLine)) {
    return;
  }
  await writeFile(cssPath, css.replace(importLine, `${importLine}\n${pluginLine}`));
}
