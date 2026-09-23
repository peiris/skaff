import { spawn } from "node:child_process";
import type { CommandResult } from "@/types/command-result";

// Child CLIs still emit spinners and cursor-control escapes with CI=1; rendering those raw
// through OpenTUI moves the real cursor and leaves glyphs behind.
const stripControl = (text: string) =>
  text
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/\u001b\][^\u0007]*\u0007/g, "")
    .replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/g, "");

// On Windows the package-manager binaries are .cmd shims, so the spawn needs cmd.exe. cmd.exe
// splits on & | < > ^ and spaces, and the shadcn preset URL contains &, so those args get quoted.
const windows = process.platform === "win32";
const shellArg = (arg: string) => (windows && /[\s&|<>^]/.test(arg) ? `"${arg}"` : arg);

export function runCommand(args: string[], cwd: string, onOutput: (line: string) => void): Promise<CommandResult> {
  return new Promise((resolve) => {
    const [command, ...rest] = args;
    const child = spawn(command, rest.map(shellArg), {
      cwd,
      shell: windows,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, CI: "1", FORCE_COLOR: "0" },
    });
    const chunks: string[] = [];
    const push = (data: Buffer) => {
      const text = stripControl(data.toString());
      chunks.push(text);
      const line = text.trim().split(/\r?\n|\r/).at(-1)?.trim();
      if (line) {
        onOutput(line);
      }
    };
    child.stdout.on("data", push);
    child.stderr.on("data", push);
    child.on("error", (error) => resolve({ ok: false, output: error.message }));
    child.on("close", (code) => resolve({ ok: code === 0, output: chunks.join("") }));
  });
}
