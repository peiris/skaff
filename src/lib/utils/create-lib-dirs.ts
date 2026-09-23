import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dirs = ["lib/hooks", "lib/utils", "lib/actions", "types"];

export async function createLibDirs(projectDir: string): Promise<void> {
  for (const name of dirs) {
    const dir = join(projectDir, name);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, ".gitkeep"), "", { flag: "wx" }).catch(() => undefined);
  }
}
