import { basename } from "node:path";
import { fontMeta } from "@/lib/font";
import { packageManagerCommands } from "@/lib/package-manager";
import { projectDir } from "@/lib/scaffold-config";
import { ctaLinkSource } from "@/lib/utils/cta-link-source";
import type { FileMap } from "@/types/file-map";
import type { ScaffoldConfig } from "@/types/scaffold-config";

const fontDeclaration = (googleExport: string, name: string, variable: string) =>
  `const ${name} = ${googleExport}({ subsets: ["latin"], variable: "${variable}" });`;

const errorBoundaryProps = `{ error: Error & { digest?: string }; retry: () => void }`;

const errorCopy = { code: "500", title: "Something went wrong", description: "An unexpected error occurred. Try again, or head back home." };

const layoutSource = (config: ScaffoldConfig, withHeading: boolean) => {
  const sansExport = fontMeta[config.font].googleExport;
  const shadcn = config.features.has("shadcn");
  const query = config.features.has("tanstackQuery");
  const nuqs = config.features.has("nuqs");
  const providers = [
    ...(shadcn ? ["ThemeProvider"] : []),
    ...(nuqs ? ["NuqsAdapter"] : []),
    ...(query ? ["QueryProvider"] : []),
    ...(shadcn ? ["Toaster"] : []),
  ];
  const tree = providers.reduceRight((inner, provider) => `<${provider}>${inner}</${provider}>`, "{children}");
  const fontImports = new Set([sansExport, "Geist_Mono", ...(withHeading ? ["Playfair_Display"] : [])]);
  const imports = [
    ...(query ? ['import { QueryProvider } from "@/components/providers/query-provider";'] : []),
    ...(shadcn
      ? [
          'import { ThemeProvider } from "@/components/providers/theme-provider";',
          'import { Toaster } from "@/components/ui/toast";',
          'import { cn } from "@/lib/utils/cn";',
        ]
      : []),
    'import { site } from "@/lib/site";',
    'import type { Metadata } from "next";',
    `import { ${[...fontImports].sort().join(", ")} } from "next/font/google";`,
    ...(nuqs ? ['import { NuqsAdapter } from "nuqs/adapters/next/app";'] : []),
    'import "./globals.css";',
  ];
  const declarations = [
    fontDeclaration(sansExport, "sans", "--font-sans"),
    fontDeclaration("Geist_Mono", "mono", "--font-geist-mono"),
    ...(withHeading ? [fontDeclaration("Playfair_Display", "heading", "--font-heading")] : []),
  ];
  const variables = ["sans.variable", "mono.variable", ...(withHeading ? ["heading.variable"] : [])];
  const htmlClass = shadcn
    ? `cn("h-full antialiased font-sans", ${variables.join(", ")})`
    : `\`h-full antialiased font-sans \${[${variables.join(", ")}].join(" ")}\``;
  return `${imports.join("\n")}

${declarations.join("\n")}

export const metadata: Metadata = {
  title: { default: site.name, template: \`%s · \${site.name}\` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={${htmlClass}}${shadcn ? " suppressHydrationWarning" : ""}>
      <body className="flex min-h-full flex-col">${providers.length > 0 ? `\n        ${tree}\n      ` : "{children}"}</body>
    </html>
  );
}
`;
};

const themeProviderSource = `"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

type ThemeProviderProps = { children: ReactNode };

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
`;

const queryProviderSource = `"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { useState } from "react";

type QueryProviderProps = { children: ReactNode };

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
`;

const pageSource = `import { SkaffOverview } from "@/components/skaff/skaff-overview";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <SkaffOverview />
    </main>
  );
}
`;

const nextConfigSource = (auth: boolean) => `${auth ? 'import { withEmulate } from "@emulators/adapter-next";\n' : ""}import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
  },
};

export default ${auth ? "withEmulate(nextConfig, { routePrefix: \"/api/emulate\" })" : "nextConfig"};
`;

const errorPageSource = (shadcn: boolean) => `${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { SectionContainer } from "@/components/section-container";
import Link from "next/link";
import type { ReactNode } from "react";

type ErrorPageProps = { code: string; title: string; description: string; children?: ReactNode };

export function ErrorPage({ code, title, description, children }: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center py-24 md:py-32">
        <SectionContainer className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm text-muted-foreground">{code}</p>
            <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h1>
            <p className="max-w-xl text-lg text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {children}
            ${ctaLinkSource(shadcn, { href: "/", label: "Go home", variant: "outline" })}
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}
`;

const statusPageSource = (component: string, code: string, title: string, description: string) => `import { ErrorPage } from "@/components/error-page";

export default function ${component}() {
  return <ErrorPage code="${code}" title="${title}" description="${description}" />;
}
`;

const retryButton = (shadcn: boolean) =>
  shadcn
    ? `<Button onClick={retry}>Try again</Button>`
    : `<button type="button" onClick={retry} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
        Try again
      </button>`;

const errorSource = (shadcn: boolean) => `"use client";

import { ErrorPage } from "@/components/error-page";

${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { useEffect } from "react";

export default function ErrorBoundary({ error, retry }: ${errorBoundaryProps}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage code="${errorCopy.code}" title="${errorCopy.title}" description="${errorCopy.description}">
      ${retryButton(shadcn)}
    </ErrorPage>
  );
}
`;

const globalErrorSource = (sansExport: string, shadcn: boolean) => `"use client";

import { ErrorPage } from "@/components/error-page";

${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { ${sansExport} } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";

${fontDeclaration(sansExport, "sans", "--font-sans")}

export default function GlobalError({ error, retry }: ${errorBoundaryProps}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={\`h-full antialiased font-sans \${sans.variable}\`}>
      <body className="flex min-h-full flex-col">
        <title>${errorCopy.title}</title>
        <ErrorPage code="${errorCopy.code}" title="${errorCopy.title}" description="${errorCopy.description}">
          ${retryButton(shadcn)}
        </ErrorPage>
      </body>
    </html>
  );
}
`;

const siteSource = (name: string) => `export const site = {
  name: ${JSON.stringify(name)},
  tagline: "A short line that says what this is.",
  description: "One sentence for search engines and link previews.",
  url: "https://example.com",
} as const;
`;

const sectionContainerSource = (shadcn: boolean) => `${shadcn ? 'import { cn } from "@/lib/utils/cn";\n' : ""}import type { ReactNode } from "react";

type SectionContainerProps = { children: ReactNode; className?: string };

export function SectionContainer({ children, className }: SectionContainerProps) {
  return <div className={${shadcn ? 'cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)' : '`mx-auto w-full max-w-6xl px-4 md:px-6 ${className ?? ""}`'}}>{children}</div>;
}
`;

const motionRevealSource = `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MotionRevealProps = { children: ReactNode; className?: string; delay?: number };

export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
`;

const claudeSettingsSource = (run: string) =>
  `${JSON.stringify(
    { permissions: { allow: ["check", "fix", "typecheck", "build"].map((script) => `Bash(${run} ${script}*)`) } },
    null,
    2,
  )}\n`;

export function appShellFiles(config: ScaffoldConfig): FileMap {
  const shadcn = config.features.has("shadcn");
  const motion = config.features.has("motion");
  const withHeading = shadcn && config.shadcnPreset === "sera";
  const name = config.name === "." ? basename(projectDir(config)) : config.name;
  return {
    "app/layout.tsx": layoutSource(config, withHeading),
    "app/(marketing)/page.tsx": pageSource,
    "app/not-found.tsx": statusPageSource("NotFound", "404", "Page not found", "The page you are looking for does not exist or has moved."),
    "app/forbidden.tsx": statusPageSource("Forbidden", "403", "Access denied", "You do not have permission to view this page."),
    "app/unauthorized.tsx": statusPageSource("Unauthorized", "401", "Sign in required", "You need to be signed in to view this page."),
    "app/error.tsx": errorSource(shadcn),
    "app/global-error.tsx": globalErrorSource(fontMeta[config.font].googleExport, shadcn),
    "components/error-page.tsx": errorPageSource(shadcn),
    "components/section-container.tsx": sectionContainerSource(shadcn),
    ...(motion ? { "components/motion-reveal.tsx": motionRevealSource } : {}),
    ...(shadcn ? { "components/providers/theme-provider.tsx": themeProviderSource } : {}),
    ...(config.features.has("tanstackQuery") ? { "components/providers/query-provider.tsx": queryProviderSource } : {}),
    "next.config.ts": nextConfigSource(config.features.has("auth")),
    "lib/site.ts": siteSource(name),
    ".claude/settings.json": claudeSettingsSource(packageManagerCommands[config.packageManager].run),
  };
}
