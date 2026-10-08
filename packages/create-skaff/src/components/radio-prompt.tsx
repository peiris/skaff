import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { palette } from "@/lib/palette";
import type { RadioPromptProps } from "@/types/prompt-props";

export function RadioPrompt<T extends string>({ title, options, initialValue, onSelect }: RadioPromptProps<T>) {
  const [index, setIndex] = useState(
    Math.max(
      0,
      options.findIndex((option) => option.value === initialValue),
    ),
  );

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setIndex((current) => (current + options.length - 1) % options.length);
    } else if (key.name === "down" || key.name === "j") {
      setIndex((current) => (current + 1) % options.length);
    } else if (key.name === "return") {
      onSelect(options[index].value);
    }
  });

  return (
    <box flexDirection="column">
      <text>
        <span fg={palette.accent}>◆</span>  <strong>{title}</strong>
      </text>
      {options.map((option, i) => (
        <text key={option.value}>
          <span fg={palette.accent}>│  </span>
          {i === index ? <span fg={palette.success}>◉ </span> : <span fg={palette.faint}>○ </span>}
          <span fg={i === index ? palette.text : palette.muted}>{option.label}</span>
          {option.description ? <span fg={palette.dim}>{`  ${option.description}`}</span> : null}
        </text>
      ))}
      <text>
        <span fg={palette.accent}>│  </span>
        <span fg={palette.dim}>↑↓ to move · Enter to continue · Esc to go back</span>
      </text>
    </box>
  );
}
