import { useKeyboard } from "@opentui/react";
import { authProviders } from "@/lib/auth-providers";
import { useScaffoldRunner } from "@/lib/hooks/use-scaffold-runner";
import { packageManagerCommands } from "@/lib/package-manager";
import { palette } from "@/lib/palette";
import { StepRow } from "@/components/step-row";
import type { ProgressTimelineProps } from "@/types/prompt-props";

export function ProgressTimeline({ config, onExit }: ProgressTimelineProps) {
  const { steps, finished, error } = useScaffoldRunner(config);
  useKeyboard((key) => {
    if (finished && (key.name === "q" || key.name === "return")) {
      onExit();
    }
  });
  return (
    <box flexDirection="column">
      {steps
        .filter((step) => step.status !== "pending")
        .map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
      {error ? (
        <box flexDirection="column">
          <text>
            <span fg={palette.danger}>└  Failed</span>
          </text>
          <text fg={palette.danger}>{error}</text>
        </box>
      ) : null}

      {finished && !error ? (
        <box
          alignSelf="flex-start"
          border
          borderStyle="rounded"
          borderColor={palette.accent}
          paddingLeft={2}
          paddingRight={2}
          marginTop={1}
          flexDirection="column"
        >
          {config.dryRun ? (
            <text>
              <strong fg={palette.accent}>Dry run.</strong> <span fg={palette.muted}>Nothing was written.</span>
            </text>
          ) : (
            <>
              <text>
                <strong fg={palette.accent}>Done.</strong> <span fg={palette.muted}>Next steps:</span>
              </text>
              <text> </text>
              {config.name === "." ? null : <text fg={palette.muted}>{`cd ${config.name}`}</text>}
              {config.features.has("auth") ? (
                <>
                  <text fg={palette.muted}>Fill in the OAuth values in .env.local:</text>
                  {authProviders.map((provider) => (
                    <text key={provider.id} fg={palette.muted}>
                      {`  ${provider.envPrefix}_CLIENT_ID, ${provider.envPrefix}_CLIENT_SECRET  `}
                      <span fg={palette.dim}>{`${provider.console} · callback http://localhost:3000/api/auth/callback/${provider.id}`}</span>
                    </text>
                  ))}
                </>
              ) : null}
              <text fg={palette.muted}>{`${packageManagerCommands[config.packageManager].run} dev`}</text>
            </>
          )}
        </box>
      ) : null}

      {finished ? (
        <text fg={palette.dim} marginTop={1}>
          Enter or q to exit
        </text>
      ) : null}
    </box>
  );
}
