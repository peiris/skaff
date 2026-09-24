import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { packageManagerCommands } from "@/lib/package-manager";
import rulesTemplate from "@/templates/agent-rules.md" with { type: "text" };
import ultraciteTemplate from "@/templates/ultracite-rules.md" with { type: "text" };
import type { ScaffoldConfig } from "@/types/scaffold-config";

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  );

const dropSection = (text: string, heading: string) => text.replace(new RegExp(`### ${heading}[\\s\\S]*?(?=\\n### |\\n## )`), "");

export async function writeAgentConfig(projectDir: string, config: ScaffoldConfig): Promise<void> {
  const pm = packageManagerCommands[config.packageManager];
  const fill = (template: string) =>
    template
      .replaceAll("{{dlx}}", pm.dlx.join(" "))
      .replaceAll("{{exec}}", pm.exec.join(" "))
      .replaceAll("{{shadcnStyle}}", `base-${config.shadcnPreset}`)
      .replaceAll("{{run}}", pm.run);
  const rules = [
    fill(config.features.has("nuqs") ? rulesTemplate : dropSection(rulesTemplate, "URL state goes through nuqs")),
    fill(ultraciteTemplate),
  ]
    .map((section) => section.trim())
    .join("\n\n");
  const agentsPath = join(projectDir, "AGENTS.md");
  const claudePath = join(projectDir, "CLAUDE.md");
  const current = (await exists(agentsPath)) ? await readFile(agentsPath, "utf8") : "";
  if (!current.includes(rules)) {
    await writeFile(agentsPath, current ? `${current.trimEnd()}\n\n${rules}\n` : `${rules}\n`);
  }
  if (!(await exists(claudePath))) {
    await writeFile(claudePath, "@AGENTS.md\n");
  }
}
