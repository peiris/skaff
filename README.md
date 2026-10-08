# Skaff

Monorepo for [create-skaff](packages/create-skaff), the Next.js scaffolder, and [skaff.dev](apps/web), its marketing site.

```
apps/web                 skaff.dev (Next.js)
packages/create-skaff    the create-skaff CLI published to npm
```

```sh
bun install
bun run dev          # every app and package, via turbo
bun run typecheck
bun run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for how the CLI is developed and released.
