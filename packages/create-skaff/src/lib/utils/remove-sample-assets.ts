import { rm } from "node:fs/promises";
import { join } from "node:path";

const sampleAssets = ["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"].map((asset) => join("public", asset));

export async function removeSampleAssets(projectDir: string): Promise<void> {
  await Promise.all([...sampleAssets, join("app", "page.tsx")].map((asset) => rm(join(projectDir, asset), { force: true })));
}
