import { palette } from "@/lib/palette";
import type { AnsweredRowProps } from "@/types/prompt-props";

export function AnsweredRow({ label, value }: AnsweredRowProps) {
  return (
    <text>
      <span fg={palette.success}>◇</span>  {label} <span fg={palette.muted}>{value}</span>
    </text>
  );
}
