import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// shadcn's SidebarMenuSkeleton picks its width with Math.random() during render, which Cache
// Components rejects as sync IO during prerender. Derive the width from useId instead.
export async function patchSidebarSkeleton(projectDir: string): Promise<void> {
  const path = join(projectDir, "components", "ui", "sidebar.tsx");
  const source = await readFile(path, "utf8").catch(() => null);
  if (source === null) {
    return;
  }
  const randomWidth = /\n[ \t]*\/\/ Random width[^\n]*\n[ \t]*const \[width\] = React\.useState\(\(\) => \{\n[ \t]*return `\$\{Math\.floor\(Math\.random\(\) \* 40\) \+ 50\}%`\n[ \t]*\}\)\n/;
  const patched = source.replace(
    randomWidth,
    "\n  const id = React.useId()\n  const width = `${([...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 40) + 50}%`\n",
  );
  if (patched.includes("Math.random")) {
    throw new Error("components/ui/sidebar.tsx still calls Math.random() in render; update patchSidebarSkeleton for the current shadcn sidebar");
  }
  await writeFile(path, patched);
}
