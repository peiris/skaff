```
███████╗ ██╗  ██╗  █████╗  ███████╗ ███████╗
██╔════╝ ██║ ██╔╝ ██╔══██╗ ██╔════╝ ██╔════╝
███████╗ █████╔╝  ███████║ █████╗   █████╗
╚════██║ ██╔═██╗  ██╔══██║ ██╔══╝   ██╔══╝
███████║ ██║  ██╗ ██║  ██║ ██║      ██║
╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝      ╚═╝
```

# create-skaff

**Start a new Next.js app with the boring setup already done.**

Run one command, answer a few questions, and get a ready-to-build project: styling, UI components, linting, error pages, sign-in, and AI coding assistant setup — all installed and connected for you.

```sh
npx create-skaff@latest my-app
```

Then:

```sh
cd my-app
npm run dev
```

---

## Why use it?

Setting up a new Next.js project usually means an hour of installing packages, copying config files, and wiring things together before you write any real code. Skaff does that part for you, the same way every time, so you can start on your actual app.

## What you get

**In every project:**

- **Next.js + TypeScript** — the standard Next.js starter, using the App Router
- **Tailwind CSS v4** — for styling, with extra spacing and text-size presets
- **Ready-made pages** — a landing page, plus 404, error, and "access denied" pages
- **Linting and formatting** — catches mistakes and keeps code tidy, with editor settings included
- **AI assistant setup** — instructions and skills so Claude Code and Codex understand your project from day one
- **A README for your new app** — explaining what's inside and how to run it

**Optional extras** (all turned on by default, switch off what you don't need):

| Extra | What it's for |
| --- | --- |
| shadcn/ui | A full set of good-looking UI components (buttons, dialogs, forms…) plus light/dark mode |
| Better Auth | Sign in with Google or GitHub, with a protected dashboard page |
| TanStack Query | Fetching and caching data from APIs |
| Motion | Animations |
| nuqs | Keeping things like filters and tabs in the page URL |
| Tailwind Typography | Nice default styling for blog posts and long text |

## Try sign-in without any setup

If you turn on Better Auth, sign-in works straight away with **fake Google and GitHub accounts**. You don't need to create any OAuth apps just to try it out.

When you're ready for real sign-in:

1. Open `.env.local` and remove `AUTH_EMULATE=true`
2. Add your keys: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
3. Set the callback URL in each provider to `http://localhost:3000/api/auth/callback/google` (or `/github`)

## What the setup asks you

You'll pick:

- **Project name** — or `.` to use the current folder
- **Package manager** — npm, pnpm, or bun
- **Icons** — Lucide or Hugeicons
- **Font** — Geist, Inter, Roboto, and more
- **Extras** — from the table above
- **Component style** — a visual theme for shadcn/ui (only if you chose it)

Press **Enter** to confirm and **Esc** to go back.

## More ways to run it

```sh
npx create-skaff@latest            # asks for a project name
npx create-skaff@latest my-app     # uses "my-app" as the name
npx create-skaff@latest .          # sets up in the current folder
npx create-skaff@latest --dry-run  # preview what would happen, without changing anything
```

Using pnpm or bun? `pnpm dlx create-skaff@latest` and `bunx create-skaff@latest` work too.

## Requirements

- Node.js 26.9 or newer
- macOS, Linux, or Windows

<details>
<summary><strong>Full details: every file and package it adds</strong></summary>

### Always included

- **Next.js** via `create-next-app@latest` — App Router, TypeScript, no `src/` folder, `@/*` import alias
- **Tailwind CSS v4** — extra `@theme` tokens for breakpoints, container widths, and a text scale
- **App shell** — root layout with your chosen Google font, a `(marketing)` landing page, `not-found`, `forbidden`, `unauthorized`, `error` and `global-error` pages, shared `ErrorPage` and `SectionContainer` components, `lib/site.ts` for site metadata, and `lib/hooks`, `lib/utils`, `lib/actions` and `types` folders
- **Ultracite** (Oxlint + Oxfmt) — with the `anti-slop` plugin, React and Next.js rules, `oxlint.config.ts`, `oxfmt.config.ts`, `.vscode/settings.json`, and a `typecheck` script
- **AI agent config** — `AGENTS.md` with coding rules, `CLAUDE.md` pointing to it, `.claude/settings.json`, and skills for Claude Code and Codex from `vercel-labs/next.js-experimental`, `vercel-labs/agent-skills` and `vercel-labs/agent-browser`
- **agent-browser** — dev dependency with its browser downloaded, so AI agents can test your app in a real browser

### Optional

| Extra | What gets installed and configured |
| --- | --- |
| Tailwind Typography | `@tailwindcss/typography`, registered in `app/globals.css` |
| shadcn/ui | `shadcn init` with your preset, icons and font; every component added; aliases set to `lib/utils/cn` and `lib/hooks`; `next-themes`; the shadcn lint plugin and agent skill |
| Motion | `motion` |
| TanStack Query | `@tanstack/react-query` + devtools, with a provider in the layout |
| nuqs | `nuqs`, plus an `AGENTS.md` rule that URL state goes through it |
| Better Auth | `better-auth` with SQLite, Google and GitHub sign-in, `/sign-in` and `/dashboard` routes, a `proxy.ts` route guard, sign-in/sign-out components, `.env.local` keys, and `auth migrate` run for you |

shadcn/ui presets: Maia, Nova, Vega, Lyra, Mira, Luma, Sera, Rhea.

</details>

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to run and build the CLI locally.

## License

MIT