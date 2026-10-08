import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import oxfmt from "@/templates/oxfmt.config.ts.txt" with { type: "text" };
import oxlintTemplate from "@/templates/oxlint.config.ts.txt" with { type: "text" };
import vscodeSettings from "@/templates/vscode-settings.json.txt" with { type: "text" };

export async function writeLintConfig(projectDir: string, shadcn: boolean): Promise<void> {
  const oxlint = oxlintTemplate
    .replace("{{shadcnImport}}\n", shadcn ? 'import shadcn from "ultracite/oxlint/shadcn";\n\n' : "\n")
    .replace("{{shadcnExtend}}", shadcn ? ", shadcn" : "")
    .replace("{{shadcnJsPlugins}}", shadcn ? "jsPlugins: shadcn.jsPlugins,\n  " : "");
  await mkdir(join(projectDir, ".vscode"), { recursive: true });
  await Promise.all([
    writeFile(join(projectDir, "oxlint.config.ts"), oxlint),
    writeFile(join(projectDir, "oxfmt.config.ts"), oxfmt),
    writeFile(join(projectDir, ".vscode", "settings.json"), vscodeSettings),
  ]);
}
