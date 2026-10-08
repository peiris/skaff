import { useKeyboard } from "@opentui/react";
import { palette } from "@/lib/palette";
import type { NodeVersionNoticeProps } from "@/types/prompt-props";

const fixes =
  process.platform === "win32"
    ? [
        ["nvm-windows", "nvm install 22 && nvm use 22"],
        ["fnm", "fnm install 22 && fnm use 22"],
        ["volta", "volta install node@22"],
        ["winget", "winget install OpenJS.NodeJS.LTS"],
      ]
    : [
        ["nvm", "nvm install 22 && nvm use 22"],
        ["fnm", "fnm install 22 && fnm use 22"],
        ["volta", "volta install node@22"],
        ["Homebrew", "brew install node@22 && brew link --overwrite node@22"],
      ];

export function NodeVersionNotice({ problem, onExit }: NodeVersionNoticeProps) {
  useKeyboard(onExit);
  return (
    <box flexDirection="column" paddingLeft={1} paddingTop={1}>
      <box alignSelf="flex-start" border borderStyle="rounded" borderColor={palette.danger} paddingLeft={2} paddingRight={2} flexDirection="column">
        <text>
          <strong fg={palette.danger}>skaff</strong> <span fg={palette.faint}>·</span> <span fg={palette.muted}>unsupported Node.js</span>
        </text>
        <text> </text>
        <text>{problem}</text>
        <text> </text>
        <text fg={palette.muted}>Switch with whichever you use, then run skaff again:</text>
        {fixes.map(([name, command]) => (
          <text key={name}>
            <span fg={palette.muted}>{`${name.padEnd(13)}`}</span>
            <span fg={palette.accent}>{command}</span>
          </text>
        ))}
        <text> </text>
        <text fg={palette.muted}>Pin it for this project by adding a .nvmrc containing 22.</text>
      </box>
      <text> </text>
      <text fg={palette.dim}>Press any key to exit</text>
    </box>
  );
}
