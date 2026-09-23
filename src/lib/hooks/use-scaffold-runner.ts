import { useEffect, useState } from "react";
import { buildScaffoldSteps } from "@/lib/scaffold-steps";
import type { ScaffoldConfig } from "@/types/scaffold-config";
import type { RunnerState, StepState } from "@/types/step-state";

export function useScaffoldRunner(config: ScaffoldConfig): RunnerState {
  const [plan] = useState(() => buildScaffoldSteps(config));
  const [steps, setSteps] = useState<StepState[]>(() =>
    plan.map((step) => ({
      id: step.id,
      label: step.label,
      status: config.dryRun ? "done" : "pending",
      lastLine: "",
      detail: config.dryRun ? step.describe : "",
    })),
  );
  const [finished, setFinished] = useState(config.dryRun);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (config.dryRun) {
      return;
    }
    const patch = (id: string, changes: Partial<StepState>) =>
      setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...changes } : step)));

    const run = async () => {
      for (const step of plan) {
        patch(step.id, { status: "running" });
        const result = await step.run((line) => patch(step.id, { lastLine: line }));
        if (!result.ok) {
          patch(step.id, { status: "failed" });
          setError(result.output.trim().split("\n").slice(-12).join("\n"));
          setFinished(true);
          return;
        }
        patch(step.id, { status: "done", lastLine: "" });
      }
      setFinished(true);
    };

    run();
  }, []);

  return { steps, finished, error };
}
