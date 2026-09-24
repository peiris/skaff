import { _electron as electron } from "playwright-core";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const project = process.argv[2];
const udd = `${process.env.HOME}/Library/Caches/skaff-demo-vscode`;
mkdirSync(`${udd}/udd/User`, { recursive: true });
mkdirSync(`${udd}/ext`, { recursive: true });
copyFileSync(new URL("./vscode-settings.json", import.meta.url), `${udd}/udd/User/settings.json`);
rmSync(`${udd}/udd/User/workspaceStorage`, { recursive: true, force: true });
mkdirSync("demo/ide/frames", { recursive: true });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const app = await electron.launch({
  executablePath: "/Applications/Visual Studio Code.app/Contents/MacOS/Code",
  args: [`--user-data-dir=${udd}/udd`, `--extensions-dir=${udd}/ext`, "--disable-workspace-trust", "--skip-welcome", "--skip-release-notes", "--disable-telemetry", "--disable-updates", "--new-window", project],
});
const page = await app.firstWindow();
await app.evaluate(({ BrowserWindow }) => {
  for (const w of BrowserWindow.getAllWindows()) w.setBounds({ x: 0, y: 40, width: 1440, height: 900 });
});
const row = (name) => page.locator(`.explorer-folders-view .monaco-list-row[aria-label="${name}"]`).first();
await row("app").waitFor({ timeout: 60000 });
await page.addStyleTag({ content: ".notifications-toasts { display: none !important; }" });
await pause(1500);

let recording = true;
const stamps = [];
const capture = (async () => {
  let i = 0;
  while (recording) {
    const t = Date.now();
    await page.screenshot({ path: `demo/ide/frames/${String(i).padStart(4, "0")}.png`, type: "png" });
    stamps.push([i, t]);
    i += 1;
  }
})();

await pause(1500);
const act = async (name, ms = 1100) => {
  await row(name).hover();
  await pause(250);
  await row(name).click();
  await pause(ms);
};
await act("app");
await act("(marketing)");
await act("page.tsx", 3000);
await act("app", 900);
await act("components");
await act("skaff", 1600);
await act("components", 900);
await act("lib");
await act("hooks", 1400);
await act("lib", 900);
await act("types", 3000);
recording = false;
await capture;

const lines = [];
for (let k = 0; k < stamps.length; k += 1) {
  const [i, t] = stamps[k];
  const next = stamps[k + 1]?.[1] ?? t + 500;
  lines.push(`file 'frames/${String(i).padStart(4, "0")}.png'`, `duration ${((next - t) / 1000).toFixed(3)}`);
}
lines.push(`file 'frames/${String(stamps.at(-1)[0]).padStart(4, "0")}.png'`);
writeFileSync("demo/ide/frames.txt", lines.join("\n"));
console.log("frames", stamps.length, "seconds", ((stamps.at(-1)[1] - stamps[0][1]) / 1000).toFixed(1));
await app.close();
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "demo/ide/frames.txt", "-vf", "scale=1920:-2,fps=30", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "demo/skaff-ide.mp4"]);
