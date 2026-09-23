import type { PackageManager, PackageManagerCommands } from "@/types/package-manager";

export const packageManagers: PackageManager[] = ["npm", "pnpm", "bun"];

export const packageManagerCommands: Record<PackageManager, PackageManagerCommands> = {
  npm: { dlx: ["npx", "-y"], add: ["npm", "install"], addDev: ["npm", "install", "-D"], run: "npm run", createNextFlag: "--use-npm" },
  pnpm: { dlx: ["pnpm", "dlx"], add: ["pnpm", "add"], addDev: ["pnpm", "add", "-D"], run: "pnpm", createNextFlag: "--use-pnpm" },
  bun: { dlx: ["bunx"], add: ["bun", "add"], addDev: ["bun", "add", "-d"], run: "bun run", createNextFlag: "--use-bun" },
};
