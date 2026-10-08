import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const tokens = {
  light: { muted: "#f5f5f5", "muted-foreground": "#737373", border: "#e5e5e5" },
  dark: { muted: "#262626", "muted-foreground": "#a3a3a3", border: "#262626" },
};

const declarations = (values: Record<keyof typeof tokens.light, string>, indent: string) =>
  Object.entries(values)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join("\n");

// create-next-app's globals.css only defines --background and --foreground; without shadcn the
// generated sections still use muted, border and font-heading. Tailwind v4 merges repeated @theme
// blocks, and its default border color is currentColor, so the base layer restores the border token.
const baseTokens = `:root {
${declarations(tokens.light, "  ")}
}

@media (prefers-color-scheme: dark) {
  :root {
${declarations(tokens.dark, "    ")}
  }
}

@theme inline {
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --font-heading: var(--font-sans);
}

@layer base {
  *,
  ::before,
  ::after {
    border-color: var(--color-border);
  }
}
`;

export async function addBaseTokens(projectDir: string): Promise<void> {
  const path = join(projectDir, "app", "globals.css");
  const css = await readFile(path, "utf8");
  if (css.includes("--color-muted:")) {
    return;
  }
  await writeFile(path, `${css.trimEnd()}\n\n${baseTokens}`);
}
