# Contributing

Thanks for helping out. This page covers how to run the CLI from source, where things live, and how releases work.

## Set up

You need Node.js 26.4 or newer and [bun](https://bun.sh). Bun is only used for development; the published package runs on plain Node.

```sh
git clone https://github.com/peiris/skaff.git
cd skaff
bun install
```

## Run it

```sh
bun run dev                  # start the wizard from source
bun run dev -- --dry-run     # walk through the prompts without writing anything
bun run dev -- my-app        # pre-fill the project name
```

To try a real scaffold, run it from a scratch folder so you don't fill the repo with generated projects:

```sh
cd /tmp && bun ~/path/to/skaff/src/index.tsx test-app
```

## Check your work

```sh
bun run typecheck     # TypeScript
bun run build         # bundles src/index.tsx into dist/index.js
```

Before opening a pull request, run a full scaffold with all extras on and make sure the generated app starts with `npm run dev`, typechecks, and passes `npm run check`.

## Where things live

```
bin/skaff.js                  checks the Node version, then loads dist/index.js
src/index.tsx                 reads the command line and starts the wizard
src/components/               each prompt screen and the progress view
src/lib/scaffold-steps.ts     the ordered list of commands and files the wizard runs
src/lib/                      option tables: features, fonts, icons, presets, package managers
src/lib/utils/                one file per step: file writers and config patches
src/templates/                AGENTS.md rules, Oxlint and Oxfmt config, VS Code settings
src/types/                    one type per file
```

The wizard is a React app drawn in the terminal with [OpenTUI](https://github.com/sst/opentui) and bundled with esbuild.

## Adding an extra

1. Add its id to `src/types/feature.ts` and a label to `src/lib/features.ts`.
2. Add the install and file-writing steps in `src/lib/scaffold-steps.ts`.
3. Put any generated files in a new `src/lib/utils/<name>-files.ts`.
4. Add it to the tree and stack in `src/lib/scaffold-manifest.ts` so the generated README and landing page mention it.
5. Add it to the project structure tree in `README.md`.

## Code style

- One component, hook, helper, or type per file, named after what it exports.
- No `any`, `unknown`, or loose object types. Write the shape.
- No comments unless they explain something the code can't, like a quirk in a tool we call.
- Helpers earn their place by holding a decision. One-liners get inlined.

## Releasing

Every push to `main` runs the publish workflow. It typechecks, bumps the patch version, builds, publishes to npm, and pushes the version commit back. There's nothing to do by hand.

To publish from your machine instead:

```sh
bun run release
```
