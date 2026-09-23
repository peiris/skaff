import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const breakpoints: [string, number][] = [["sm", 40], ["md", 48], ["lg", 64], ["xl", 80], ["2xl", 96]];

const containers: [string, number][] = [
  ["3xs", 16], ["2xs", 18], ["xs", 20], ["sm", 24], ["md", 28], ["lg", 32], ["xl", 36],
  ["2xl", 42], ["3xl", 48], ["4xl", 56], ["5xl", 64], ["6xl", 72], ["7xl", 80],
];

const textSizes: [string, number, number][] = [
  ["xxs", 0.625, 0.875], ["xs", 0.75, 1], ["sm", 0.875, 1.25], ["base", 1, 1.5], ["lg", 1.125, 1.75],
  ["xl", 1.25, 1.75], ["2xl", 1.5, 2], ["3xl", 1.875, 2.25], ["4xl", 2.25, 2.5],
  ["5xl", 3, 3], ["6xl", 3.75, 3.75], ["7xl", 4.5, 4.5], ["8xl", 6, 6], ["9xl", 8, 8],
];

const px = (rem: number) => `${rem * 16}px`;
const remLine = (name: string, rem: number) => `  --${name}: ${rem}rem; /* ${px(rem)} */`;

const themeTokens = [
  "@theme {",
  ...breakpoints.map(([name, rem]) => remLine(`breakpoint-${name}`, rem)),
  "",
  ...containers.map(([name, rem]) => remLine(`container-${name}`, rem)),
  "",
  ...textSizes.flatMap(([name, size, line]) => [
    remLine(`text-${name}`, size),
    size === line
      ? `  --text-${name}--line-height: 1; /* ${px(line)} */`
      : `  --text-${name}--line-height: calc(${line} / ${size}); /* ${px(line)} */`,
  ]),
  "}",
].join("\n");

export async function addThemeTokens(projectDir: string): Promise<void> {
  const cssPath = join(projectDir, "app", "globals.css");
  const css = await readFile(cssPath, "utf8");
  if (css.includes("--breakpoint-sm")) {
    return;
  }
  const lines = css.split("\n");
  let end = 0;
  for (const [index, line] of lines.entries()) {
    if (/^@(import|plugin|source|custom-variant)\b/.test(line)) {
      end = index + 1;
    } else if (line.trim() !== "") {
      break;
    }
  }
  const head = lines.slice(0, end).join("\n");
  const tail = lines.slice(end).join("\n").replace(/^\n+/, "");
  await writeFile(cssPath, `${head}\n\n${themeTokens}\n\n${tail}`);
}
