import { projectDir } from "@/lib/scaffold-config";
import { palette } from "@/lib/palette";
import type { ConfirmPromptProps } from "@/types/prompt-props";

export function ConfirmPrompt({ config }: ConfirmPromptProps) {
  return (
    <box flexDirection="column">
      <text>
        <span fg={palette.accent}>◆</span>  <strong>{config.dryRun ? "Dry run: preview commands for " : "Scaffold into "}{projectDir(config)}?</strong>
      </text>
      <text>
        <span fg={palette.accent}>│  </span>
        <span fg={palette.dim}>Enter to start · Esc to go back</span>
      </text>
    </box>
  );
}
