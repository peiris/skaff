import type { FeatureId } from "@/types/feature";
import type { RadioOption } from "@/types/radio-option";
import type { ScaffoldConfig } from "@/types/scaffold-config";
import type { StepState } from "@/types/step-state";

export type WizardAppProps = { initialName: string; cwd: string; dryRun: boolean };

export type NamePromptProps = { initialValue: string; onSubmit: (name: string) => void };

export type RadioPromptProps<T extends string> = {
  title: string;
  options: RadioOption<T>[];
  initialValue: T;
  onSelect: (value: T) => void;
};

export type FeaturesPromptProps = { initialValue: FeatureId[]; onSubmit: (features: FeatureId[]) => void };

export type ConfirmPromptProps = { config: ScaffoldConfig };

export type ProgressTimelineProps = { config: ScaffoldConfig; onExit: () => void };

export type StepRowProps = { step: StepState };

export type AnsweredRowProps = { label: string; value: string };

export type NodeVersionNoticeProps = { problem: string; onExit: () => void };
