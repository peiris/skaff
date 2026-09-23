import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { allFeatures, featureGroups } from "@/lib/features";
import { palette } from "@/lib/palette";
import type { FeatureId } from "@/types/feature";
import type { FeaturesPromptProps } from "@/types/prompt-props";

export function FeaturesPrompt({ initialValue, onSubmit }: FeaturesPromptProps) {
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<FeatureId[]>(initialValue);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setCursor((current) => (current + allFeatures.length - 1) % allFeatures.length);
    } else if (key.name === "down" || key.name === "j") {
      setCursor((current) => (current + 1) % allFeatures.length);
    } else if (key.name === "space") {
      const id = allFeatures[cursor].id;
      setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    } else if (key.name === "a") {
      setSelected((current) => (current.length === allFeatures.length ? [] : allFeatures.map((feature) => feature.id)));
    } else if (key.name === "return") {
      onSubmit(allFeatures.map((feature) => feature.id).filter((id) => selected.includes(id)));
    }
  });

  return (
    <box flexDirection="column">
      <text>
        <span fg={palette.accent}>◆</span>  <strong>What to set up</strong>
      </text>
      {featureGroups.map((group) => (
        <box key={group.title} flexDirection="column">
          <text>
            <span fg={palette.accent}>│  </span>
            <span fg={palette.muted}>{group.title}</span>
          </text>
          {group.features.map((feature) => {
            const active = allFeatures.indexOf(feature) === cursor;
            const checked = selected.includes(feature.id);
            return (
              <text key={feature.id}>
                <span fg={palette.accent}>│  </span>
                <span fg={active ? palette.accent : palette.faint}>{active ? "❯ " : "  "}</span>
                <span fg={checked ? palette.success : palette.faint}>{checked ? "◼ " : "◻ "}</span>
                <span fg={active ? palette.text : palette.subtle}>{feature.label}</span>
              </text>
            );
          })}
        </box>
      ))}
      <text>
        <span fg={palette.accent}>│  </span>
        <span fg={palette.dim}>↑↓ to move · Space to toggle · a to toggle all · Enter to continue · Esc to go back</span>
      </text>
    </box>
  );
}
