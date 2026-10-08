import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { FileMap } from "@/types/file-map";

export async function writeFiles(projectDir: string, files: FileMap): Promise<void> {
  const dirs = new Set(Object.keys(files).map((path) => dirname(join(projectDir, path))));
  await Promise.all([...dirs].map((dir) => mkdir(dir, { recursive: true })));
  await Promise.all(Object.entries(files).map(([path, source]) => writeFile(join(projectDir, path), source)));
}
