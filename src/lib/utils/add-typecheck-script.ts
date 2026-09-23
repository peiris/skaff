import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PackageJson } from "@/types/package-json";

export async function addTypecheckScript(projectDir: string): Promise<void> {
  const path = join(projectDir, "package.json");
  const pkg: PackageJson = JSON.parse(await readFile(path, "utf8"));
  pkg.scripts = { ...pkg.scripts, typecheck: "tsc --noEmit" };
  await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`);
}
