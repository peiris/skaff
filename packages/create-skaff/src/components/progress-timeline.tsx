import React from "react";
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

  const nextSteps = [
    config.name === "." ? null : { title: "Enter the project", command: `cd ${config.name}` },
    config.features.has("auth") ? { title: "Fill in the OAuth values in .env.local", providers: authProviders } : null,
    { title: "Start the dev server", command: `${packageManagerCommands[config.packageManager].run} dev` },
  ].filter((step) => step !== null);

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
            <React.Fragment>
              <text>
                <strong fg={palette.accent}>Done.</strong> <span fg={palette.muted}>Next steps</span>
              </text>
              {nextSteps.map((step, index) => (
                <box key={step.title} flexDirection="column" marginTop={1}>
                  <text>
                    <span fg={palette.accent}>{`${index + 1}.`}</span>{" "}
                    {step.command ? (
                      <span fg={palette.text}>{step.command}</span>
                    ) : (
                      <span fg={palette.subtle}>{step.title}</span>
                    )}
                  </text>
                  {step.providers?.map((provider) => (
                    <box key={provider.id} flexDirection="column" paddingLeft={3} marginTop={1}>
                      <text fg={palette.text}>{provider.label}</text>
                      <text fg={palette.muted}>{`${provider.envPrefix}_CLIENT_ID`}</text>
                      <text fg={palette.muted}>{`${provider.envPrefix}_CLIENT_SECRET`}</text>
                      <text>
                        <span fg={palette.dim}>Console   </span>
                        <span fg={palette.muted}>{provider.console}</span>
                      </text>
                      <text>
                        <span fg={palette.dim}>Callback  </span>
                        <span fg={palette.muted}>{`http://localhost:3000/api/auth/callback/${provider.id}`}</span>
                      </text>
                    </box>
                  ))}
                </box>
              ))}
            </React.Fragment>
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
