import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// pnpm 10+ skips dependency build scripts unless allowlisted under allowBuilds in
// pnpm-workspace.yaml; better-sqlite3 compiles natively and agent-browser downloads its binary.
export async function allowPnpmBuild(projectDir: string, pkg: string): Promise<void> {
  const path = join(projectDir, "pnpm-workspace.yaml");
  const current = await readFile(path, "utf8").catch(() => "");
  const entry = `  ${pkg}: true`;
  const lines = current.split("\n");
  const existing = lines.findIndex((line) => line.trim().startsWith(`${pkg}:`));
  if (existing !== -1) {
    lines[existing] = entry;
    await writeFile(path, lines.join("\n"));
    return;
  }
  const block = lines.indexOf("allowBuilds:");
  if (block !== -1) {
    lines.splice(block + 1, 0, entry);
    await writeFile(path, lines.join("\n"));
    return;
  }
  await writeFile(path, `${current.trimEnd()}${current.trim() ? "\n\n" : ""}allowBuilds:\n${entry}\n`);
}
