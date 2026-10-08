import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentsJson } from "@/types/components-json";

// Runs between `shadcn init` and `shadcn add`, so every component and hook is generated against
// the one-file-per-helper layout the agent rules require instead of shadcn's lib/utils.ts default.
export async function configureShadcn(projectDir: string): Promise<void> {
  const configPath = join(projectDir, "components.json");
  const config: ComponentsJson = JSON.parse(await readFile(configPath, "utf8"));
  config.aliases.utils = "@/lib/utils/cn";
  config.aliases.hooks = "@/lib/hooks";
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const legacyUtils = join(projectDir, "lib", "utils.ts");
  const utilsDir = join(projectDir, "lib", "utils");
  await mkdir(utilsDir, { recursive: true });
  await rename(legacyUtils, join(utilsDir, "cn.ts")).catch(() => writeFile(join(utilsDir, "cn.ts"), 'export { cn } from "cn"\n'));
  const legacyHooks = join(projectDir, "hooks");
  const hooksDir = join(projectDir, "lib", "hooks");
  await mkdir(hooksDir, { recursive: true });
  for (const file of await readdir(legacyHooks).catch(() => [])) {
    await rename(join(legacyHooks, file), join(hooksDir, file));
  }
  await rm(legacyHooks, { recursive: true, force: true });
}
