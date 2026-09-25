#!/usr/bin/env node
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 26 || (major === 26 && minor < 10)) {
  const lines = [
    "Upgrade Node, then run skaff again:",
    "",
    "macOS / Linux",
    "  nvm install 26 && nvm use 26",
    "  or: fnm install 26 && fnm use 26",
    "",
    "Windows",
    "  winget install OpenJS.NodeJS",
    "  or (nvm-windows): nvm install 26.10.0 && nvm use 26.10.0",
    "",
    "Installer for any platform: https://nodejs.org/en/download",
  ];
  const width = Math.max(...lines.map((line) => line.length));
  const box = [
    `╭${"─".repeat(width + 2)}╮`,
    ...lines.map((line) => `│ ${line.padEnd(width)} │`),
    `╰${"─".repeat(width + 2)}╯`,
  ];
  console.error(`\n\x1b[31mSkaff needs Node 26.10 or newer (found ${process.versions.node}).\x1b[0m\n\n${box.join("\n")}\n`);
  process.exit(1);
}
await import("../dist/index.js");
