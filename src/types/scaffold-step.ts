import type { CommandResult } from "@/types/command-result";

export type OnOutput = (line: string) => void;

export type ScaffoldAction = { describe: string; run: (onOutput: OnOutput) => Promise<CommandResult> };

export type ScaffoldStep = ScaffoldAction & { id: string; label: string };

export type SkillPackage = { id: string; repo: string; skills: string[] };
