import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { NodeVersionNotice } from "@/components/node-version-notice";
import { WizardApp } from "@/components/wizard-app";
import { checkNodeVersion } from "@/lib/utils/check-node-version";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const initialName = args.find((arg) => !arg.startsWith("--")) ?? "";

const renderer = await createCliRenderer({ exitOnCtrlC: true });
const nodeProblem = checkNodeVersion();
createRoot(renderer).render(
  nodeProblem ? (
    <NodeVersionNotice
      problem={nodeProblem}
      onExit={() => {
        renderer.destroy();
        process.exit(1);
      }}
    />
  ) : (
    <WizardApp initialName={initialName} cwd={process.cwd()} dryRun={dryRun} />
  ),
);
