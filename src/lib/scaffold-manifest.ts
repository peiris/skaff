import { basename } from "node:path";
import { authProviders } from "@/lib/auth-providers";
import { fontMeta } from "@/lib/font";
import { iconLibraryMeta } from "@/lib/icon-library";
import { packageManagerCommands } from "@/lib/package-manager";
import { projectDir } from "@/lib/scaffold-config";
import { shadcnPresetMeta } from "@/lib/shadcn-presets";
import { version } from "@/lib/version";
import type { ManifestChoice, ManifestNextStep, ManifestStackEntry, ManifestTreeNode, ScaffoldManifest } from "@/types/scaffold-manifest";
import type { FeatureId } from "@/types/feature";
import type { ScaffoldConfig } from "@/types/scaffold-config";

export const landingDir = "components/skaff";
export const manifestTypePath = "types/scaffold-manifest.ts";
export const landingRemoval = `Delete ${landingDir}/ and ${manifestTypePath}, then replace <SkaffOverview /> in app/(marketing)/page.tsx with your own sections.`;

export function scaffoldManifest(config: ScaffoldConfig): ScaffoldManifest {
  const { features, iconLibrary, font, shadcnPreset } = config;
  const has = (id: FeatureId) => features.has(id);
  const shadcn = has("shadcn");
  const auth = has("auth");
  const pm = packageManagerCommands[config.packageManager];
  const run = pm.run;
  const dlx = pm.dlx.join(" ");
  const exec = pm.exec.join(" ");

  const choices: ManifestChoice[] = [
    { label: "Package manager", value: config.packageManager },
    { label: "Icons", value: iconLibraryMeta[iconLibrary].label },
    { label: "Font", value: fontMeta[font].label },
    ...(shadcn ? [{ label: "shadcn preset", value: shadcnPresetMeta[shadcnPreset].label }] : []),
  ];

  const stack: ManifestStackEntry[] = [
    { name: "Next.js", role: "App Router with TypeScript, cacheComponents on", url: "https://nextjs.org" },
    { name: "Tailwind CSS v4", role: "Breakpoints, containers and text scale declared in @theme", url: "https://tailwindcss.com" },
    ...(has("typography")
      ? [{ name: "Tailwind Typography", role: "prose classes for long-form content", url: "https://github.com/tailwindlabs/tailwindcss-typography" }]
      : []),
    ...(shadcn
      ? [
          {
            name: "shadcn/ui",
            role: `Base UI, ${shadcnPresetMeta[shadcnPreset].label} preset, all components installed, next-themes and Toaster mounted`,
            url: "https://ui.shadcn.com",
          },
        ]
      : []),
    { name: iconLibraryMeta[iconLibrary].label, role: `Icons from ${iconLibraryMeta[iconLibrary].description}`, url: iconLibraryMeta[iconLibrary].url },
    { name: fontMeta[font].label, role: "Base font, loaded through next/font as --font-sans", url: "https://fonts.google.com" },
    ...(has("motion") ? [{ name: "Motion", role: "Animation, with a MotionReveal wrapper for scroll-in sections", url: "https://motion.dev" }] : []),
    ...(has("nuqs") ? [{ name: "nuqs", role: "Type-safe URL search-param state, adapter mounted in the root layout", url: "https://nuqs.dev" }] : []),
    ...(has("tanstackQuery")
      ? [{ name: "TanStack Query", role: "Client data fetching with devtools, provided in components/providers", url: "https://tanstack.com/query" }]
      : []),
    ...(auth
      ? [
          {
            name: "Better Auth",
            role: `${authProviders.map((provider) => provider.label).join(" and ")} sign-in on SQLite, providers emulated locally`,
            url: "https://better-auth.com",
          },
        ]
      : []),
    { name: "Ultracite", role: "Oxlint and Oxfmt with anti-slop rules", url: "https://ultracite.ai" },
    { name: "agent-browser", role: "Browser automation CLI that coding agents use to load and test pages", url: "https://agent-browser.dev" },
  ];

  const only = (enabled: boolean, nodes: ManifestTreeNode[]) => (enabled ? nodes : []);

  const tree: ManifestTreeNode[] = [
    {
      name: "app/",
      purpose: "Routes and layouts; pages live in route groups that share the root layout without affecting URLs",
      children: [
        { name: "(marketing)/page.tsx", purpose: "Homepage; this overview renders here until you replace it" },
        ...only(auth, [
          { name: "(auth)/", purpose: "Sign-in page and the emulated account picker" },
          { name: "(dashboard)/dashboard/", purpose: "Member dashboard; the session read streams inside <Suspense> so the shell prerenders" },
          { name: "api/auth/", purpose: "Better Auth route handler" },
          { name: "api/emulate/", purpose: "Same-origin OAuth emulators for local sign-in, off unless AUTH_EMULATE=true" },
        ]),
        { name: "layout.tsx", purpose: "Root layout: fonts, metadata and providers" },
        { name: "globals.css", purpose: "Tailwind import and the @theme block with breakpoints, containers and text sizes" },
        { name: "not-found.tsx", purpose: "404, rendered through components/error-page.tsx like the rest" },
        { name: "error.tsx", purpose: "Route error boundary with a retry button" },
        { name: "global-error.tsx", purpose: "Root layout error boundary" },
        { name: "forbidden.tsx", purpose: "403 for forbidden(); experimental.authInterrupts is on in next.config.ts" },
        { name: "unauthorized.tsx", purpose: "401 for unauthorized()" },
      ],
    },
    {
      name: "components/",
      purpose: "One component per file, named <domain>-<role>.tsx",
      children: [
        ...only(shadcn, [{ name: "ui/", purpose: "shadcn/ui components, managed by the CLI" }]),
        ...only(shadcn || has("tanstackQuery"), [{ name: "providers/", purpose: "Context providers mounted in app/layout.tsx" }]),
        { name: "skaff/", purpose: "This overview page; delete the folder when you start building" },
        { name: "section-container.tsx", purpose: "Width and gutter wrapper; every section-*.tsx is a <section> with vertical padding wrapping it" },
        { name: "error-page.tsx", purpose: "Shared layout for the error routes" },
        ...only(has("motion"), [{ name: "motion-reveal.tsx", purpose: "Scroll-in reveal that respects reduced motion" }]),
        ...only(auth, [
          { name: "auth-sign-in-buttons.tsx", purpose: "Provider buttons on /sign-in" },
          { name: "auth-sign-out-button.tsx", purpose: "Signs out and returns home" },
          { name: "dashboard-welcome.tsx", purpose: "Reads the session and greets the member" },
        ]),
      ],
    },
    {
      name: "lib/",
      children: [
        { name: "site.ts", purpose: "Site name, tagline, description and URL used by metadata and copy" },
        ...only(auth, [{ name: "auth/", purpose: "Better Auth server config, React client, emulated providers and seeded accounts" }]),
        { name: "hooks/", purpose: "One hook per file" },
        { name: "utils/", purpose: `One helper per file${shadcn ? "; cn.ts lives here" : ""}` },
        { name: "actions/", purpose: "Server actions" },
      ],
    },
    { name: "types/", purpose: "Shared types" },
    ...only(auth, [{ name: "proxy.ts", purpose: "Cookie check that redirects between /sign-in and /dashboard before the page renders" }]),
    { name: "next.config.ts", purpose: `cacheComponents and authInterrupts on${auth ? "; wrapped in withEmulate for the OAuth emulators" : ""}` },
    { name: "AGENTS.md", purpose: "Rules for coding agents; CLAUDE.md points at it and .claude/settings.json pre-approves the scripts and agent-browser" },
  ];

  const scripts = [
    { command: `${run} dev`, purpose: "Start the dev server" },
    { command: `${run} build`, purpose: "Production build" },
    { command: `${run} start`, purpose: "Serve the production build" },
    { command: `${run} typecheck`, purpose: "TypeScript check" },
    { command: `${run} check`, purpose: "Lint and format check (Oxlint + Oxfmt)" },
    { command: `${run} fix`, purpose: "Auto-fix lint and formatting" },
  ];

  const nextSteps: ManifestNextStep[] = [
    { title: "Name the site", detail: "Edit lib/site.ts; metadata and the hero read from it." },
    { title: "Build the first section", detail: "Create components/section-<what>.tsx shaped like the sections in components/skaff/ and render it from app/(marketing)/page.tsx." },
    ...(shadcn ? [{ title: "Add UI", detail: `${dlx} shadcn@latest add <component>` }] : []),
    ...(auth
      ? [{ title: "Try sign-in", detail: "Open /sign-in and pick a seeded account. Real providers: put credentials in .env.local and set AUTH_EMULATE=false (see README)." }]
      : []),
    { title: "Point agents at the rules", detail: "AGENTS.md holds the project rules; skills are installed under .agents/ and .claude/. Agents test pages with agent-browser, not Playwright." },
    { title: "Remove this page", detail: landingRemoval },
  ];

  return {
    name: config.name === "." ? basename(projectDir(config)) : config.name,
    version,
    packageManager: { name: config.packageManager, run, dlx, exec },
    choices,
    stack,
    tree,
    scripts,
    nextSteps,
    auth: auth ? { providers: authProviders.map(({ id, label, console, envPrefix }) => ({ id, label, console, envPrefix })) } : null,
  };
}
