import { palette } from "@/lib/palette";
import type { StepRowProps } from "@/types/prompt-props";
import type { StepState } from "@/types/step-state";

const glyphs: Record<StepState["status"], { icon: string; color: string }> = {
  pending: { icon: "○", color: palette.faint },
  running: { icon: "◆", color: palette.warning },
  done: { icon: "✔", color: palette.success },
  failed: { icon: "■", color: palette.danger },
};

export function StepRow({ step }: StepRowProps) {
  const glyph = glyphs[step.status];
  const detail = step.detail || (step.status === "running" ? step.lastLine.slice(0, 80) : "");
  return (
    <box flexDirection="column">
      {step.status === "running" ? <text fg={palette.faint}>│</text> : null}
      <text>
        <span fg={glyph.color}>{glyph.icon}</span>  <span fg={step.status === "pending" ? palette.dim : palette.text}>{step.label}</span>
      </text>
      {detail ? (
        <text>
          <span fg={palette.faint}>│  </span>
          <span fg={palette.dim}>{detail}</span>
        </text>
      ) : null}
    </box>
  );
}
