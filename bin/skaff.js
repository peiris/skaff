#!/usr/bin/env node
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 26 || (major === 26 && minor < 9)) {
  console.error(`\x1b[31mcreate-skaff needs Node 26.9 or newer (found ${process.versions.node}).\x1b[0m`);
  process.exit(1);
}
await import("../dist/index.js");
