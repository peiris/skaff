import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { authConfigPath } from "@/lib/auth-providers";
import { landingRemoval, scaffoldManifest } from "@/lib/scaffold-manifest";
import { projectDir } from "@/lib/scaffold-config";
import type { ManifestTreeNode } from "@/types/scaffold-manifest";
import type { ScaffoldConfig } from "@/types/scaffold-config";

const layoutRows = (nodes: ManifestTreeNode[], prefix = ""): string[] =>
  nodes.flatMap((node) => {
    const path = `${prefix}${node.name}`;
    const purpose = node.purpose?.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return [...(purpose ? [`| \`${path}\` | ${purpose} |`] : []), ...layoutRows(node.children ?? [], path)];
  });

export async function writeReadme(config: ScaffoldConfig): Promise<void> {
  const dir = projectDir(config);
  const manifest = scaffoldManifest(config);
  const { run, dlx, exec } = manifest.packageManager;
  const shadcn = config.features.has("shadcn");

  const authSection = manifest.auth
    ? `
## Authentication

Better Auth is configured in \`lib/auth/server.ts\` and \`lib/auth/client.ts\`, served from \`app/api/auth/[...all]/route.ts\`. Sessions live in \`sqlite.db\` (git-ignored); re-run the migration after changing plugins:

\`\`\`bash
${dlx} auth@latest migrate --yes --config ${authConfigPath}
\`\`\`

### Emulated providers (default)

\`.env.local\` ships with \`AUTH_EMULATE=true\`, so sign-in works out of the box with no OAuth credentials. [emulate](https://emulate.dev) serves fake ${manifest.auth.providers.map((provider) => provider.label).join(" and ")} OAuth servers from \`app/api/emulate/[...path]/route.ts\` on the same origin, and \`lib/auth/emulated-providers.ts\` points Better Auth's generic OAuth plugin at them. Clicking a provider button opens the account picker at \`app/(auth)/emulated-sign-in/[provider]/page.tsx\`, which posts the chosen account to the emulator; the seeded accounts live in \`lib/auth/emulated-accounts.ts\` and feed both the picker and the emulator seed. Emulator state is in-memory and resets when the dev server restarts. The route returns 404 whenever \`AUTH_EMULATE\` is not \`true\`, so it is inert in production.

### Switching to the real providers

1. Create an OAuth app with each provider and register the callback URL shown below (use the deployed origin in production).
2. Put the credentials in \`.env.local\` and set \`AUTH_EMULATE=false\` (or delete the line). In production set \`BETTER_AUTH_URL\` to the deployed origin and leave \`AUTH_EMULATE\` unset.
3. Restart the dev server. \`lib/auth/server.ts\` switches to the built-in \`socialProviders\` automatically.

| Variable | Where to get it | Callback URL |
| --- | --- | --- |
${manifest.auth.providers
  .map(
    (provider) =>
      `| \`${provider.envPrefix}_CLIENT_ID\`, \`${provider.envPrefix}_CLIENT_SECRET\` | [${provider.label}](${provider.console}) | \`http://localhost:3000/api/auth/callback/${provider.id}\` |`,
  )
  .join("\n")}

Once you no longer need the emulators, delete \`app/api/emulate/\`, \`app/(auth)/emulated-sign-in/\`, \`components/emulated-account-picker.tsx\`, \`lib/auth/emulated-providers.ts\` and \`lib/auth/emulated-accounts.ts\`, drop the \`emulated\` branch in \`lib/auth/server.ts\`, unwrap \`withEmulate\` in \`next.config.ts\`, and remove the \`@emulators/*\` packages.

\`/sign-in\` shows the provider buttons (\`components/auth-sign-in-buttons.tsx\`). \`/dashboard\` reads the session with \`auth.api.getSession\` inside \`<Suspense>\` and redirects to \`/sign-in\` when there is none; \`proxy.ts\` does the same check on the session cookie before the page renders. Guard other pages the same way.
`
    : "";

  const readme = `# ${manifest.name}

Scaffolded with [create-skaff](https://www.npmjs.com/package/create-skaff) v${manifest.version}.

## Stack

${manifest.stack.map((entry) => `- [${entry.name}](${entry.url}): ${entry.role}`).join("\n")}

## Getting started

\`\`\`bash
${manifest.packageManager.name} install
${run} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000). The homepage is a disposable overview of this scaffold. When you start building: ${landingRemoval.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}

## Scripts

| Command | What it does |
| --- | --- |
${manifest.scripts.map((script) => `| \`${script.command}\` | ${script.purpose} |`).join("\n")}

## Project layout

| Path | Purpose |
| --- | --- |
${layoutRows(manifest.tree).join("\n")}

## Design tokens

Breakpoints, container widths and the text scale are declared in a \`@theme\` block at the top of \`app/globals.css\`. Edit the values there rather than using arbitrary classes.
${
  shadcn
    ? `
## Adding UI

\`\`\`bash
${dlx} shadcn@latest add <component>
\`\`\`

\`components.json\` points the \`utils\` alias at \`lib/utils/cn\` and the \`hooks\` alias at \`lib/hooks\`.
`
    : ""
}${authSection}
## AI agents

Project rules for coding agents live in \`AGENTS.md\`. \`CLAUDE.md\` points at it. \`.claude/settings.json\` pre-approves the check, fix, typecheck and build scripts so agents can verify without prompts. Skills are installed under \`.agents/\` and \`.claude/\` via [skills.sh](https://skills.sh).

Browser checks run through [agent-browser](https://agent-browser.dev), installed as a dev dependency with Chrome for Testing downloaded by \`agent-browser install\`. Agents load \`${exec} agent-browser skills get core\` and drive the dev server from there instead of Playwright or a local browser.
`;

  await writeFile(join(dir, "README.md"), readme);
}
