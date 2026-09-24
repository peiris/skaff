```
███████╗ ██╗  ██╗  █████╗  ███████╗ ███████╗
██╔════╝ ██║ ██╔╝ ██╔══██╗ ██╔════╝ ██╔════╝
███████╗ █████╔╝  ███████║ █████╗   █████╗
╚════██║ ██╔═██╗  ██╔══██║ ██╔══╝   ██╔══╝
███████║ ██║  ██╗ ██║  ██║ ██║      ██║
╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝      ╚═╝
```

# create-skaff

Interactive, batteries-included Next.js scaffolder. Answer a few prompts in a terminal UI and get an App Router project with TypeScript, Tailwind CSS v4, an app shell, linting, formatting, AI-agent config and optional shadcn/ui, Motion, TanStack Query, nuqs and Better Auth already wired up.

```sh
npx create-skaff@latest my-app
```

## Requirements

- Node.js 26.9 or newer
- npm, pnpm or bun (you pick one in the wizard; it is used for every install and `dlx` call)
- macOS, Linux or Windows

## Usage

```sh
npx create-skaff@latest            # prompts for a project name
npx create-skaff@latest my-app     # pre-fills the name
npx create-skaff@latest .          # scaffolds into the current directory
npx create-skaff@latest --dry-run  # shows every command and file write without touching disk
```

`pnpm dlx create-skaff@latest` and `bunx create-skaff@latest` work the same way. The package also exposes a `skaff` binary.

The wizard walks through these prompts. Esc goes back a step, Enter confirms.

| Prompt | Options |
| --- | --- |
| Project name | any directory name, or `.` |
| Package manager | npm, pnpm, bun |
| Icon library | Lucide, Hugeicons |
| Font | Geist, Inter, Noto Sans, Roboto, Public Sans, IBM Plex Sans, Instrument Sans, JetBrains Mono, Geist Mono |
| What to set up | Tailwind Typography, shadcn/ui, Motion, TanStack Query, nuqs, Better Auth (all on by default) |
| shadcn/ui preset | Maia, Nova, Vega, Lyra, Mira, Luma, Sera, Rhea (only when shadcn/ui is selected) |

A progress timeline then runs each step, streaming the last line of output. When it finishes it prints the next steps, including the OAuth keys to fill in if you enabled auth.

## What you get

Every project, regardless of the options you pick:

- **Next.js** (App Router, TypeScript, no `src/` dir, `@/*` import alias) created with `create-next-app@latest`.
- **Tailwind CSS v4** with extra `@theme` tokens for breakpoints, container widths and a text scale.
- **App shell**: root layout with the chosen Google font, a `(marketing)` landing page, `not-found`, `forbidden`, `unauthorized`, `error` and `global-error` pages, a shared `ErrorPage` and `SectionContainer`, `lib/site.ts` for site metadata, and `lib/hooks`, `lib/utils`, `lib/actions` and `types` directories.
- **Ultracite** with Oxlint and Oxfmt, the `anti-slop` plugin, React and Next.js rule sets, generated `oxlint.config.ts`, `oxfmt.config.ts` and `.vscode/settings.json`, plus a `typecheck` script.
- **AI agent config**: `AGENTS.md` with project coding rules, `CLAUDE.md` pointing at it, `.claude/settings.json`, and skills installed for Claude Code and Codex from `vercel-labs/next.js-experimental`, `vercel-labs/agent-skills` and `vercel-labs/agent-browser`.
- **agent-browser** installed as a dev dependency with its browser downloaded, for agent-driven browser testing.
- A project-specific **README.md** describing the stack, tree, scripts and next steps for the generated app.

Optional features:

| Feature | What it adds |
| --- | --- |
| Tailwind Typography | `@tailwindcss/typography` registered as a plugin in `app/globals.css` |
| shadcn/ui | `shadcn init` with the chosen preset, icon library and font, every component added, aliases pointed at `lib/utils/cn` and `lib/hooks`, `next-themes`, the shadcn lint plugin and the shadcn agent skill |
| Motion | `motion` installed |
| TanStack Query | `@tanstack/react-query` and devtools installed with a provider in the layout |
| nuqs | `nuqs` installed with a rule in `AGENTS.md` that URL state goes through it |
| Better Auth | `better-auth` with a SQLite database, Google and GitHub social sign-in, `/sign-in` and `/dashboard` routes, a `proxy.ts` guard, sign-in and sign-out components, `.env.local` keys and a run of `auth migrate` |

### Auth without OAuth credentials

When Better Auth is selected, the project ships with locally emulated Google and GitHub providers and `AUTH_EMULATE=true` already set in `.env.local`. The sign-in page routes through `/api/emulate/*` with a fake account picker, so you can build the signed-in experience before creating any OAuth apps. Remove the flag and fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to use the real providers. The callback URL for each is `http://localhost:3000/api/auth/callback/<provider>`.

## Development

The CLI is a React app rendered in the terminal with [OpenTUI](https://github.com/sst/opentui) and bundled with esbuild. Bun is used only for development; the published package runs on plain Node.

```sh
bun install
bun run dev          # run the wizard from source
bun run dev -- --dry-run
bun run typecheck
bun run build        # bundles src/index.tsx into dist/index.js
```

Layout:

```
bin/skaff.js          Node version guard, then imports dist/index.js
src/index.tsx         parses argv, mounts the wizard
src/components/       prompt screens and the progress timeline
src/lib/              option tables (features, fonts, presets, package managers)
src/lib/scaffold-steps.ts   the ordered list of commands and file writes
src/lib/utils/        one file per step helper (file writers, config patches)
src/templates/        AGENTS.md rules, Oxlint and Oxfmt config, VS Code settings
src/types/            one type per file
```

Pushing to `main` runs the publish workflow, which typechecks, bumps the patch version, builds and publishes to npm.

## License

MIT
