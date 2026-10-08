import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { GitignoreSection } from "@/types/gitignore-section";

export async function extendGitignore(projectDir: string, sections: GitignoreSection[]): Promise<void> {
  const path = join(projectDir, ".gitignore");
  const current = await readFile(path, "utf8").catch(() => "");
  const missing = sections.filter((section) => !section.patterns.every((pattern) => current.includes(pattern)));
  if (missing.length === 0) {
    return;
  }
  const body = missing.map((section) => [section.comment, ...section.patterns].join("\n")).join("\n\n");
  await writeFile(path, `${current.trimEnd()}\n\n${body}\n`);
}
