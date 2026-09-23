import { writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { authConfigPath, authProviders } from "@/lib/auth-providers";
import { packageManagerCommands } from "@/lib/package-manager";
import { projectDir } from "@/lib/scaffold-config";
import type { ScaffoldConfig } from "@/types/scaffold-config";

export async function writeReadme(config: ScaffoldConfig): Promise<void> {
  const { name, packageManager, features, iconLibrary, font, shadcnPreset } = config;
  const dir = projectDir(config);
  const pm = packageManagerCommands[packageManager];
  const run = pm.run;
  const dlx = pm.dlx.join(" ");
  const title = name === "." ? basename(dir) : name;
  const auth = features.has("auth");
  const shadcn = features.has("shadcn");

  const stack = [
    "- [Next.js](https://nextjs.org) App Router with TypeScript",
    `- [Tailwind CSS v4](https://tailwindcss.com)${features.has("typography") ? " + [Typography](https://github.com/tailwindlabs/tailwindcss-typography)" : ""}`,
    ...(shadcn
      ? [`- [shadcn/ui](https://ui.shadcn.com) on Base UI, \`${shadcnPreset}\` preset, all components installed, \`next-themes\` provider in \`components/providers/theme-provider.tsx\` and \`Toaster\` (\`components/ui/toast.tsx\`) mounted in \`app/layout.tsx\``]
      : []),
    `- ${iconLibrary === "lucide" ? "[Lucide](https://lucide.dev) icons" : "[Hugeicons](https://hugeicons.com) (free set)"}`,
    `- \`${font}\` as the base font`,
    ...(features.has("motion") ? ["- [Motion](https://motion.dev) for animation"] : []),
    ...(features.has("nuqs") ? ["- [nuqs](https://nuqs.dev) for type-safe URL search-param state, adapter mounted in `app/layout.tsx`"] : []),
    ...(features.has("tanstackQuery") ? ["- [TanStack Query](https://tanstack.com/query) with devtools, provided in `components/providers/query-provider.tsx`"] : []),
    ...(auth
      ? ["- [Better Auth](https://better-auth.com) with Google and GitHub sign-in on SQLite (`better-sqlite3`), `/sign-in` and `/dashboard` routes, providers emulated locally by [emulate](https://emulate.dev)"]
      : []),
    "- [Ultracite](https://ultracite.ai) running Oxlint and Oxfmt",
  ];

  const authSection = `
## Authentication

Better Auth is configured in \`lib/auth/server.ts\` and \`lib/auth/client.ts\`, served from \`app/api/auth/[...all]/route.ts\`. Sessions live in \`sqlite.db\` (git-ignored); re-run the migration after changing plugins:

\`\`\`bash
${dlx} auth@latest migrate --yes --config ${authConfigPath}
\`\`\`

### Emulated providers (default)

\`.env.local\` ships with \`AUTH_EMULATE=true\`, so sign-in works out of the box with no OAuth credentials. [emulate](https://emulate.dev) serves fake ${authProviders.map((provider) => provider.label).join(" and ")} OAuth servers from \`app/api/emulate/[...path]/route.ts\` on the same origin, and \`lib/auth/emulated-providers.ts\` points Better Auth's generic OAuth plugin at them. Clicking a provider button opens the account picker at \`app/(auth)/emulated-sign-in/[provider]/page.tsx\`, which posts the chosen account to the emulator; the seeded accounts live in \`lib/auth/emulated-accounts.ts\` and feed both the picker and the emulator seed. Emulator state is in-memory and resets when the dev server restarts. The route returns 404 whenever \`AUTH_EMULATE\` is not \`true\`, so it is inert in production.

### Switching to the real providers

1. Create an OAuth app with each provider and register the callback URL shown below (use the deployed origin in production).
2. Put the credentials in \`.env.local\` and set \`AUTH_EMULATE=false\` (or delete the line). In production set \`BETTER_AUTH_URL\` to the deployed origin and leave \`AUTH_EMULATE\` unset.
3. Restart the dev server. \`lib/auth/server.ts\` switches to the built-in \`socialProviders\` automatically.

| Variable | Where to get it | Callback URL |
| --- | --- | --- |
${authProviders
  .map(
    (provider) =>
      `| \`${provider.envPrefix}_CLIENT_ID\`, \`${provider.envPrefix}_CLIENT_SECRET\` | [${provider.label}](${provider.console}) | \`http://localhost:3000/api/auth/callback/${provider.id}\` |`,
  )
  .join("\n")}

Once you no longer need the emulators, delete \`app/api/emulate/\`, \`app/(auth)/emulated-sign-in/\`, \`components/emulated-account-picker.tsx\`, \`lib/auth/emulated-providers.ts\` and \`lib/auth/emulated-accounts.ts\`, drop the \`emulated\` branch in \`lib/auth/server.ts\`, unwrap \`withEmulate\` in \`next.config.ts\`, and remove the \`@emulators/*\` packages.

\`/sign-in\` shows the provider buttons (\`components/auth-sign-in-buttons.tsx\`). \`/dashboard\` reads the session with \`auth.api.getSession\` inside \`<Suspense>\` and redirects to \`/sign-in\` when there is none; \`proxy.ts\` does the same check on the session cookie before the page renders. Guard other pages the same way.
`;

  const readme = `# ${title}

Scaffolded with [skaff](https://www.npmjs.com/package/create-skaff).

## Stack

${stack.join("\n")}

## Getting started

\`\`\`bash
${packageManager} install
${run} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| \`${run} dev\` | Start the dev server |
| \`${run} build\` | Production build |
| \`${run} start\` | Serve the production build |
| \`${run} typecheck\` | TypeScript check |
| \`${run} check\` | Lint and format check (Oxlint + Oxfmt) |
| \`${run} fix\` | Auto-fix lint and formatting |

## Project layout

| Path | Purpose |
| --- | --- |
| \`app/\` | Routes, layouts and \`globals.css\`; pages live in route groups (\`(marketing)\`${auth ? ", `(auth)`, `(dashboard)`" : ""}) that share the root layout without affecting URLs |
| \`components/\` | One component per file, named \`<domain>-<role>.tsx\` |
${shadcn ? "| `components/ui/` | shadcn/ui components, managed by the CLI |\n" : ""}| \`components/providers/\` | Context providers mounted in \`app/layout.tsx\` |
| \`components/section-*.tsx\` | Page sections; \`section-hero.tsx\` is the reference pattern |
| \`app/not-found.tsx\`, \`error.tsx\`, \`global-error.tsx\`, \`forbidden.tsx\`, \`unauthorized.tsx\` | Error pages per the Next.js file conventions, all rendered through \`components/error-page.tsx\`; \`forbidden()\`/\`unauthorized()\` need \`experimental.authInterrupts\`, already on in \`next.config.ts\` alongside \`cacheComponents\` |
| \`lib/site.ts\` | Site name, tagline, description and URL used by metadata and copy |
${auth ? "| `lib/auth/` | Better Auth server config (`server.ts`), React client (`client.ts`) and emulated provider config (`emulated-providers.ts`) |\n| `app/api/emulate/` | Same-origin OAuth emulators for local sign-in, off unless `AUTH_EMULATE=true` |\n| `app/(auth)/sign-in/`, `app/(dashboard)/dashboard/`, `app/api/auth/` | Sign-in page, member dashboard and auth route handler; the session read streams inside `<Suspense>` so the static shell prerenders |\n| `proxy.ts` | Cookie-based redirect between `/sign-in` and `/dashboard` before the page renders |\n" : ""}
| \`lib/hooks/\` | One hook per file |
| \`lib/utils/\` | One helper per file${shadcn ? " (`cn.ts` lives here)" : ""} |
| \`lib/actions/\` | Server actions |
| \`types/\` | Shared types |

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
}${auth ? authSection : ""}
## AI agents

Project rules for coding agents live in \`AGENTS.md\`. \`CLAUDE.md\` points at it. \`.claude/settings.json\` pre-approves the check, fix, typecheck and build scripts so agents can verify without prompts. Skills are installed under \`.agents/\` and \`.claude/\` via [skills.sh](https://skills.sh).
`;

  await writeFile(join(dir, "README.md"), readme);
}
