import { spawnSync } from "node:child_process";

// oxlint and oxfmt load their TypeScript config through Node's type stripping,
// which exists only in ^20.19.0 || >=22.18.0.
const supported = ([major, minor]: number[]) => (major === 20 && minor >= 19) || (major === 22 && minor >= 18) || major > 22;

export function checkNodeVersion(): string | null {
  const result = spawnSync("node", ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
  if (result.error || result.status !== 0) {
    return "Node.js was not found on PATH. Install Node 22.18 or newer.";
  }
  const version = result.stdout.trim();
  const parts = version.replace(/^v/, "").split(".").map(Number);
  return supported(parts) ? null : `Node ${version} is too old for Oxlint and Oxfmt config files. Use Node ^20.19 or >=22.18.`;
}
