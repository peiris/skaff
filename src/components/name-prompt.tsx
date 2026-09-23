import { useState } from "react";
import { palette } from "@/lib/palette";
import type { NamePromptProps } from "@/types/prompt-props";

export function NamePrompt({ initialValue, onSubmit }: NamePromptProps) {
  const [value, setValue] = useState(initialValue);
  const name = value.trim() || ".";
  const valid = name === "." || /^[a-z0-9][a-z0-9._-]*$/.test(name);
  return (
    <box flexDirection="column">
      <text>
        <span fg={palette.accent}>◆</span>  <strong>Project name</strong>
      </text>
      <box flexDirection="row">
        <text fg={palette.accent}>│  </text>
        <box width={40}>
          <input
            focused
            placeholder="my-app · empty or . for the current directory"
            value={initialValue}
            onInput={setValue}
            onSubmit={() => {
              if (valid) {
                onSubmit(name);
              }
            }}
          />
        </box>
      </box>
      <text>
        <span fg={palette.accent}>│  </span>
        <span fg={valid ? palette.dim : palette.danger}>lowercase letters, numbers, dots, dashes · Enter to continue</span>
      </text>
    </box>
  );
}
