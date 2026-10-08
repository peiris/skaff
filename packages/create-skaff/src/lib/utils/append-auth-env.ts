import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { authEnvKeys } from "@/lib/auth-providers";

export async function appendAuthEnv(projectDir: string): Promise<void> {
  const path = join(projectDir, ".env.local");
  const current = await readFile(path, "utf8").catch(() => "");
  const entries = [
    ["BETTER_AUTH_SECRET", randomBytes(32).toString("base64")],
    ["BETTER_AUTH_URL", "http://localhost:3000"],
    ["AUTH_EMULATE", "true"],
    ...authEnvKeys.map((key) => [key, ""]),
  ].filter(([key]) => !current.includes(`${key}=`));
  if (entries.length === 0) {
    return;
  }
  const block = ["# Better Auth", ...entries.map(([key, value]) => `${key}=${value}`)].join("\n");
  await writeFile(path, current ? `${current.trimEnd()}\n\n${block}\n` : `${block}\n`);
}
