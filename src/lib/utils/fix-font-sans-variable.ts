import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// create-next-app's globals.css maps --font-sans to Geist's --font-geist-sans; the generated layout
// declares the chosen font as --font-sans directly.
export async function fixFontSansVariable(projectDir: string): Promise<void> {
  const path = join(projectDir, "app", "globals.css");
  const css = await readFile(path, "utf8");
  await writeFile(path, css.replace("var(--font-geist-sans)", "var(--font-sans)"));
}
