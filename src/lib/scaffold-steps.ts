import { authConfigPath } from "@/lib/auth-providers";
import { iconLibraryMeta } from "@/lib/icon-library";
import { packageManagerCommands } from "@/lib/package-manager";
import { projectDir } from "@/lib/scaffold-config";
import { shadcnPresetUrl } from "@/lib/shadcn-presets";
import { addThemeTokens } from "@/lib/utils/add-theme-tokens";
import { addTypecheckScript } from "@/lib/utils/add-typecheck-script";
import { addTypographyPlugin } from "@/lib/utils/add-typography-plugin";
import { allowSqliteBuild } from "@/lib/utils/allow-sqlite-build";
import { appShellFiles } from "@/lib/utils/app-shell-files";
import { appendAuthEnv } from "@/lib/utils/append-auth-env";
import { authFiles } from "@/lib/utils/auth-files";
import { configureShadcn } from "@/lib/utils/configure-shadcn";
import { createLibDirs } from "@/lib/utils/create-lib-dirs";
import { extendGitignore } from "@/lib/utils/extend-gitignore";
import { fixFontSansVariable } from "@/lib/utils/fix-font-sans-variable";
import { patchSidebarSkeleton } from "@/lib/utils/patch-sidebar-skeleton";
import { removeSampleAssets } from "@/lib/utils/remove-sample-assets";
import { runCommand } from "@/lib/utils/run-command";
import { writeAgentConfig } from "@/lib/utils/write-agent-config";
import { writeFiles } from "@/lib/utils/write-files";
import { writeLintConfig } from "@/lib/utils/write-lint-config";
import { writeReadme } from "@/lib/utils/write-readme";
import type { CommandResult } from "@/types/command-result";
import type { FeatureId } from "@/types/feature";
import type { FileMap } from "@/types/file-map";
import type { ScaffoldAction, ScaffoldStep, SkillPackage } from "@/types/scaffold-step";
import type { ScaffoldConfig } from "@/types/scaffold-config";

const ok: CommandResult = { ok: true, output: "" };

const write = (describe: string, fn: () => Promise<void>): ScaffoldAction => ({
  describe,
  run: async () => {
    await fn();
    return ok;
  },
});

const sequence = (...actions: ScaffoldAction[]): ScaffoldAction => ({
  describe: actions.map((action) => action.describe).join(", then "),
  run: async (onOutput) => {
    let result = ok;
    for (const action of actions) {
      onOutput(action.describe);
      result = await action.run(onOutput);
      if (!result.ok) {
        return result;
      }
    }
    return result;
  },
});

export function buildScaffoldSteps(config: ScaffoldConfig): ScaffoldStep[] {
  const dir = projectDir(config);
  const pm = packageManagerCommands[config.packageManager];
  const has = (id: FeatureId) => config.features.has(id);
  const shadcn = has("shadcn");

  const command = (args: string[], cwd = dir): ScaffoldAction => ({
    describe: `$ ${args.join(" ")}`,
    run: (onOutput) => runCommand(args, cwd, onOutput),
  });
  const files = (map: FileMap): ScaffoldAction => write(`write ${Object.keys(map).join(", ")}`, () => writeFiles(dir, map));
  const step = (id: string, label: string, action: ScaffoldAction): ScaffoldStep => ({ id, label, ...action });

  const skillsStep = (pkg: SkillPackage) =>
    step(
      `skills-${pkg.id}`,
      `AI skills: ${pkg.repo}${pkg.skills[0] === "*" ? "" : ` (${pkg.skills.join(", ")})`}`,
      command([...pm.dlx, "skills@latest", "add", pkg.repo, "--skill", ...pkg.skills, "--agent", "claude-code", "codex", "-y"]),
    );

  const libraries = [
    ...(has("motion") ? ["motion"] : []),
    ...(has("nuqs") ? ["nuqs"] : []),
    ...(has("tanstackQuery") ? ["@tanstack/react-query", "@tanstack/react-query-devtools"] : []),
    ...(shadcn ? ["next-themes"] : []),
    ...iconLibraryMeta[config.iconLibrary].packages,
  ];

  return [
    step(
      "next",
      "Setting up Next.js + Tailwind",
      sequence(
        command(
          [...pm.dlx, "create-next-app@latest", config.name, "--ts", "--tailwind", "--app", "--no-src-dir", "--import-alias", "@/*", "--yes", pm.createNextFlag],
          config.cwd,
        ),
        write("extend .gitignore", () => extendGitignore(dir, [{ comment: "# playwright mcp", patterns: ["/.playwright-mcp/"] }])),
        write("create lib/hooks, lib/utils, lib/actions, types", () => createLibDirs(dir)),
      ),
    ),
    ...(has("typography")
      ? [
          step(
            "typography",
            "Tailwind Typography",
            sequence(
              command([...pm.addDev, "@tailwindcss/typography"]),
              write("add @plugin to app/globals.css", () => addTypographyPlugin(dir)),
            ),
          ),
        ]
      : []),
    ...(shadcn
      ? [
          step(
            "shadcn",
            "Setting up shadcn/ui",
            sequence(
              command([...pm.dlx, "shadcn@latest", "init", "-y", "-p", shadcnPresetUrl(config.shadcnPreset, config.iconLibrary, config.font), "--silent"]),
              write("point aliases at lib/utils/cn and lib/hooks", () => configureShadcn(dir)),
              command([...pm.dlx, "shadcn@latest", "add", "--all", "-y", "--silent"]),
              write("replace Math.random() in components/ui/sidebar.tsx", () => patchSidebarSkeleton(dir)),
            ),
          ),
        ]
      : []),
    step("theme-tokens", "Tailwind theme tokens", write("add @theme breakpoints, container and text scales to app/globals.css", () => addThemeTokens(dir))),
    step("libraries", libraries.join(" + "), command([...pm.add, ...libraries])),
    step(
      "app-shell",
      "App shell",
      sequence(
        files(appShellFiles(config)),
        write("remove sample SVGs and app/page.tsx", () => removeSampleAssets(dir)),
        write("add typecheck script to package.json", () => addTypecheckScript(dir)),
        ...(shadcn ? [] : [write("point app/globals.css at --font-sans", () => fixFontSansVariable(dir))]),
      ),
    ),
    ...(has("auth")
      ? [
          step(
            "auth",
            "Better Auth (Google + GitHub, emulated locally, member dashboard)",
            sequence(
              ...(config.packageManager === "pnpm" ? [write("allow better-sqlite3 build in pnpm-workspace.yaml", () => allowSqliteBuild(dir))] : []),
              command([...pm.add, "better-auth", "better-sqlite3", "@emulators/adapter-next", "@emulators/google", "@emulators/github"]),
              command([...pm.addDev, "@types/better-sqlite3"]),
              files(authFiles(shadcn)),
              write("append Better Auth keys to .env.local", () => appendAuthEnv(dir)),
              write("ignore *.db", () => extendGitignore(dir, [{ comment: "# sqlite", patterns: ["*.db", "*.db-journal"] }])),
              command([...pm.dlx, "auth@latest", "migrate", "--yes", "--config", authConfigPath]),
            ),
          ),
        ]
      : []),
    step(
      "ultracite",
      `Ultracite (Oxlint + anti-slop${shadcn ? " + shadcn" : ""} rules, Oxfmt)`,
      sequence(
        command([
          ...pm.dlx,
          "ultracite@latest",
          "init",
          "--pm",
          config.packageManager,
          "--linter",
          "oxlint",
          "--frameworks",
          "react",
          "next",
          ...(shadcn ? ["shadcn"] : []),
          "--js-plugins",
          "anti-slop",
          ...(shadcn ? ["@shadcn/lint"] : []),
          "--editors",
          "vscode",
          "--quiet",
        ]),
        write("write oxlint.config.ts and oxfmt.config.ts", () => writeLintConfig(dir, shadcn)),
        command([...pm.dlx, "ultracite@latest", "fix"]),
      ),
    ),
    step("agents", "Claude + Codex config", write("append project rules to AGENTS.md, ensure CLAUDE.md points at it", () => writeAgentConfig(dir, config))),
    skillsStep({ id: "next-experimental", repo: "vercel-labs/next.js-experimental", skills: ["*"] }),
    skillsStep({ id: "vercel", repo: "vercel-labs/agent-skills", skills: ["vercel-composition-patterns", "vercel-react-best-practices"] }),
    ...(shadcn ? [skillsStep({ id: "shadcn", repo: "shadcn-ui/ui", skills: ["shadcn"] })] : []),
    step("readme", "README.md", write("replace the create-next-app README with a project-specific one", () => writeReadme(config))),
  ];
}
