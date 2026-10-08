export type StepStatus = "pending" | "running" | "done" | "failed";

export type StepState = { id: string; label: string; status: StepStatus; lastLine: string; detail: string };

export type RunnerState = { steps: StepState[]; finished: boolean; error: string | null };
