import type { FeatureId } from "@/types/feature";
import type { Font } from "@/types/font";
import type { IconLibrary } from "@/types/icon-library";
import type { PackageManager } from "@/types/package-manager";
import type { ShadcnPreset } from "@/types/shadcn-preset";

export type ScaffoldConfig = {
  name: string;
  packageManager: PackageManager;
  cwd: string;
  features: ReadonlySet<FeatureId>;
  iconLibrary: IconLibrary;
  font: Font;
  shadcnPreset: ShadcnPreset;
  dryRun: boolean;
};
