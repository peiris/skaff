import { join } from "node:path";
import type { ScaffoldConfig } from "@/types/scaffold-config";

export const projectDir = (config: ScaffoldConfig) => (config.name === "." ? config.cwd : join(config.cwd, config.name));
