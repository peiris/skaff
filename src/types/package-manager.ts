export type PackageManager = "npm" | "pnpm" | "bun";

export type PackageManagerCommands = { dlx: string[]; add: string[]; addDev: string[]; run: string; createNextFlag: string };
