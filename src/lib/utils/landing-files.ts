import { landingDir, manifestTypePath, scaffoldManifest } from "@/lib/scaffold-manifest";
import { asciiLogoJsx } from "@/lib/utils/ascii-logo-jsx";
import { ctaLinkSource } from "@/lib/utils/cta-link-source";
import manifestType from "@/templates/scaffold-manifest.ts.txt" with { type: "text" };
import type { FileMap } from "@/types/file-map";
import type { IconLibrary } from "@/types/icon-library";
import type { ScaffoldConfig } from "@/types/scaffold-config";

const manifestSource = (config: ScaffoldConfig) => `import type { ScaffoldManifest } from "@/types/scaffold-manifest";

export const manifest: ScaffoldManifest = ${JSON.stringify(scaffoldManifest(config), null, 2)};
`;

const logoSource = `export function SkaffLogo() {
  return (
    <pre aria-label="skaff" className="overflow-x-auto font-mono text-xs leading-none sm:text-sm md:text-base">
${asciiLogoJsx("skaff", "      ")}
    </pre>
  );
}
`;

const heroSectionSource = (shadcn: boolean, auth: boolean) => {
  const primary = ctaLinkSource(shadcn, { href: "#next-steps", label: "Where to start", variant: "primary" });
  const secondary = auth
    ? ctaLinkSource(shadcn, { href: "/sign-in", label: "Try sign-in", variant: "outline" })
    : ctaLinkSource(shadcn, { href: "#layout", label: "Project layout", variant: "outline" });
  return `${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { manifest } from "@/components/skaff/manifest";
import { SkaffLogo } from "@/components/skaff/skaff-logo";
import { SectionContainer } from "@/components/section-container";
import Link from "next/link";

export function SkaffHeroSection() {
  return (
    <section className="py-16 md:py-24">
      <SectionContainer className="flex flex-col items-start gap-8">
        <SkaffLogo />
        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm text-muted-foreground">create-skaff v{manifest.version}</p>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {manifest.name} is scaffolded and ready to build.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            This page lists what is installed, where things live and what to do next. It is meant to be deleted once you start.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          ${primary}
          ${secondary}
        </div>
        <ul className="flex flex-wrap gap-2">
          {manifest.choices.map((choice) => (
            <li key={choice.label} className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <span className="text-muted-foreground">{choice.label}</span>
              <span className="font-mono">{choice.value}</span>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </section>
  );
}
`;
};

const sectionShellSource = `import { SectionContainer } from "@/components/section-container";
import type { ReactNode } from "react";

type SkaffSectionProps = { id: string; eyebrow: string; title: string; description?: string; children: ReactNode };

export function SkaffSection({ id, eyebrow, title, description, children }: SkaffSectionProps) {
  return (
    <section id={id} className="scroll-mt-8 border-t py-16 md:py-24">
      <SectionContainer className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-sm text-muted-foreground">{eyebrow}</p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {description ? <p className="max-w-2xl text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </SectionContainer>
    </section>
  );
}
`;

const stackSectionSource = `import { manifest } from "@/components/skaff/manifest";
import { SkaffSection } from "@/components/skaff/skaff-section";

export function SkaffStackSection() {
  return (
    <SkaffSection id="stack" eyebrow="Stack" title="What is installed" description="Every entry links to its docs. Versions are in package.json.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {manifest.stack.map((entry) => (
          <li key={entry.name}>
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <span className="font-medium">{entry.name}</span>
              <span className="text-sm text-muted-foreground">{entry.role}</span>
            </a>
          </li>
        ))}
      </ul>
    </SkaffSection>
  );
}
`;

const treeIconImports: Record<IconLibrary, string> = {
  lucide: 'import { FileIcon, FolderIcon } from "lucide-react";',
  hugeicons: 'import { File01Icon, Folder01Icon } from "@hugeicons/core-free-icons";\nimport { HugeiconsIcon } from "@hugeicons/react";',
};

const treeIcon: Record<IconLibrary, string> = {
  lucide: '{folder ? <FolderIcon className="size-4 shrink-0 text-muted-foreground" /> : <FileIcon className="size-4 shrink-0 text-muted-foreground" />}',
  hugeicons: '<HugeiconsIcon icon={folder ? Folder01Icon : File01Icon} className="size-4 shrink-0 text-muted-foreground" />',
};

const treeNodeSource = (iconLibrary: IconLibrary) => `${treeIconImports[iconLibrary]}
import type { ManifestTreeNode } from "@/types/scaffold-manifest";

type SkaffTreeNodeProps = { node: ManifestTreeNode };

export function SkaffTreeNode({ node }: SkaffTreeNodeProps) {
  const folder = node.name.endsWith("/");
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        ${treeIcon[iconLibrary]}
        <span className="font-mono text-sm">{node.name}</span>
        {node.purpose ? <span className="hidden truncate text-sm text-muted-foreground md:inline">{node.purpose}</span> : null}
      </div>
      {node.purpose ? <p className="pl-6 text-sm text-muted-foreground md:hidden">{node.purpose}</p> : null}
      {node.children ? (
        <ul className="ml-2 flex flex-col gap-1 border-l pl-4">
          {node.children.map((child) => (
            <SkaffTreeNode key={child.name} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
`;

const treeSectionSource = `import { manifest } from "@/components/skaff/manifest";
import { SkaffSection } from "@/components/skaff/skaff-section";
import { SkaffTreeNode } from "@/components/skaff/skaff-tree-node";

export function SkaffTreeSection() {
  return (
    <SkaffSection
      id="layout"
      eyebrow="Layout"
      title="Where things live"
      description="Generated files and the folders meant for your code. shadcn, Ultracite and skill files are omitted."
    >
      <ul className="flex flex-col gap-1 rounded-lg border p-4 md:p-6">
        {manifest.tree.map((node) => (
          <SkaffTreeNode key={node.name} node={node} />
        ))}
      </ul>
    </SkaffSection>
  );
}
`;

const scriptsSectionSource = `import { manifest } from "@/components/skaff/manifest";
import { SkaffSection } from "@/components/skaff/skaff-section";

export function SkaffScriptsSection() {
  return (
    <SkaffSection id="scripts" eyebrow="Scripts" title="Commands">
      <ul className="divide-y rounded-lg border">
        {manifest.scripts.map((script) => (
          <li key={script.command} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
            <code className="font-mono text-sm sm:w-56 sm:shrink-0">{script.command}</code>
            <span className="text-sm text-muted-foreground">{script.purpose}</span>
          </li>
        ))}
      </ul>
    </SkaffSection>
  );
}
`;

const nextStepsSectionSource = `import { manifest } from "@/components/skaff/manifest";
import { SkaffSection } from "@/components/skaff/skaff-section";

export function SkaffNextStepsSection() {
  return (
    <SkaffSection id="next-steps" eyebrow="Next" title="Where to start">
      <ol className="grid gap-4 md:grid-cols-2">
        {manifest.nextSteps.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-lg border p-4">
            <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{step.title}</span>
              <span className="text-sm text-muted-foreground">{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </SkaffSection>
  );
}
`;

const authSectionSource = (shadcn: boolean) => `${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { manifest } from "@/components/skaff/manifest";
import { SkaffSection } from "@/components/skaff/skaff-section";
import Link from "next/link";

export function SkaffAuthSection() {
  const auth = manifest.auth;
  if (!auth) {
    return null;
  }
  return (
    <SkaffSection
      id="auth"
      eyebrow="Auth"
      title="Sign in works already"
      description="AUTH_EMULATE=true in .env.local runs fake OAuth servers on this origin, so no credentials are needed. Emulator state resets with the dev server."
    >
      <div className="flex flex-col gap-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {auth.providers.map((provider) => (
            <li key={provider.id} className="flex flex-col gap-1 rounded-lg border p-4">
              <span className="font-medium">{provider.label}</span>
              <span className="text-sm text-muted-foreground">
                Real credentials go in {provider.envPrefix}_CLIENT_ID and {provider.envPrefix}_CLIENT_SECRET.
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          ${ctaLinkSource(shadcn, { href: "/sign-in", label: "Try sign-in", variant: "primary" })}
        </div>
      </div>
    </SkaffSection>
  );
}
`;

const overviewSource = (auth: boolean) => `${auth ? 'import { SkaffAuthSection } from "@/components/skaff/skaff-auth-section";\n' : ""}import { SkaffHeroSection } from "@/components/skaff/skaff-hero-section";
import { SkaffNextStepsSection } from "@/components/skaff/skaff-next-steps-section";
import { SkaffScriptsSection } from "@/components/skaff/skaff-scripts-section";
import { SkaffStackSection } from "@/components/skaff/skaff-stack-section";
import { SkaffTreeSection } from "@/components/skaff/skaff-tree-section";

export function SkaffOverview() {
  return (
    <>
      <SkaffHeroSection />
      <SkaffStackSection />
      <SkaffTreeSection />
      <SkaffScriptsSection />
      <SkaffNextStepsSection />${auth ? "\n      <SkaffAuthSection />" : ""}
    </>
  );
}
`;

export function landingFiles(config: ScaffoldConfig): FileMap {
  const shadcn = config.features.has("shadcn");
  const auth = config.features.has("auth");
  return {
    [manifestTypePath]: manifestType,
    [`${landingDir}/manifest.ts`]: manifestSource(config),
    [`${landingDir}/skaff-logo.tsx`]: logoSource,
    [`${landingDir}/skaff-hero-section.tsx`]: heroSectionSource(shadcn, auth),
    [`${landingDir}/skaff-section.tsx`]: sectionShellSource,
    [`${landingDir}/skaff-stack-section.tsx`]: stackSectionSource,
    [`${landingDir}/skaff-tree-node.tsx`]: treeNodeSource(config.iconLibrary),
    [`${landingDir}/skaff-tree-section.tsx`]: treeSectionSource,
    [`${landingDir}/skaff-scripts-section.tsx`]: scriptsSectionSource,
    [`${landingDir}/skaff-next-steps-section.tsx`]: nextStepsSectionSource,
    ...(auth ? { [`${landingDir}/skaff-auth-section.tsx`]: authSectionSource(shadcn) } : {}),
    [`${landingDir}/skaff-overview.tsx`]: overviewSource(auth),
  };
}
