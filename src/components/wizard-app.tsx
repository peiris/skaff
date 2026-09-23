import { useKeyboard, useRenderer } from "@opentui/react";
import { useState } from "react";
import { allFeatures, defaultFeatureIds } from "@/lib/features";
import { fonts } from "@/lib/font";
import { iconLibraries } from "@/lib/icon-library";
import { packageManagers } from "@/lib/package-manager";
import { palette } from "@/lib/palette";
import { shadcnPresets } from "@/lib/shadcn-presets";
import { AnsweredRow } from "@/components/answered-row";
import { ConfirmPrompt } from "@/components/confirm-prompt";
import { FeaturesPrompt } from "@/components/features-prompt";
import { NamePrompt } from "@/components/name-prompt";
import { ProgressTimeline } from "@/components/progress-timeline";
import { RadioPrompt } from "@/components/radio-prompt";
import type { FeatureId } from "@/types/feature";
import type { Font } from "@/types/font";
import type { IconLibrary } from "@/types/icon-library";
import type { PackageManager } from "@/types/package-manager";
import type { WizardAppProps } from "@/types/prompt-props";
import type { ScaffoldConfig } from "@/types/scaffold-config";
import type { Screen } from "@/types/screen";
import type { ShadcnPreset } from "@/types/shadcn-preset";

const allScreens: Screen[] = ["name", "packageManager", "iconLibrary", "font", "features", "shadcnPreset", "confirm", "progress"];

export function WizardApp({ initialName, cwd, dryRun }: WizardAppProps) {
  const renderer = useRenderer();
  const [screen, setScreen] = useState<Screen>("name");
  const [name, setName] = useState(initialName);
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>("lucide");
  const [font, setFont] = useState<Font>("geist");
  const [features, setFeatures] = useState<FeatureId[]>(defaultFeatureIds);
  const [shadcnPreset, setShadcnPreset] = useState<ShadcnPreset>("maia");

  const exit = () => {
    renderer.destroy();
    process.exit(0);
  };

  const usesShadcn = features.includes("shadcn");
  const screens = allScreens.filter((item) => item !== "shadcnPreset" || usesShadcn);
  const index = screens.indexOf(screen);
  const answered = (target: Screen) => index > screens.indexOf(target);
  const next = () => setScreen(screens[index + 1]);

  const config: ScaffoldConfig = { name, packageManager, cwd, features: new Set(features), iconLibrary, font, shadcnPreset, dryRun };

  useKeyboard((key) => {
    if (key.name === "escape") {
      if (screen === "name") {
        exit();
      } else if (screen !== "progress") {
        setScreen(screens[index - 1]);
      }
      return;
    }
    if (screen === "confirm" && key.name === "return") {
      next();
    }
  });

  const featureSummary =
    features.length === 0
      ? "none"
      : allFeatures
          .filter((feature) => features.includes(feature.id))
          .map((feature) => feature.label)
          .join(", ");

  return (
    <scrollbox
      flexGrow={1}
      stickyScroll
      stickyStart="bottom"
      scrollbarOptions={{ visible: false }}
      contentOptions={{ paddingLeft: 1, paddingTop: 1 }}
    >
      <box
        alignSelf="flex-start"
        border
        borderStyle="rounded"
        borderColor={palette.accent}
        paddingLeft={2}
        paddingRight={2}
        marginBottom={1}
        flexDirection="column"
      >
        <ascii-font text="skaff" font="block" color={palette.accent} />
        <text fg={palette.muted}>Interactive Batteries included Next.js website scaffolder{dryRun ? " · --dry-run" : ""}</text>
      </box>
      {answered("name") ? <AnsweredRow label="Project name" value={name} /> : null}
      {answered("packageManager") ? <AnsweredRow label="Package manager" value={packageManager} /> : null}
      {answered("iconLibrary") ? <AnsweredRow label="Icon library" value={iconLibrary} /> : null}
      {answered("font") ? <AnsweredRow label="Font" value={font} /> : null}
      {answered("features") ? <AnsweredRow label="What to set up" value={featureSummary} /> : null}
      {answered("shadcnPreset") && usesShadcn ? <AnsweredRow label="shadcn/ui preset" value={shadcnPreset} /> : null}
      {screen === "progress" ? null : <text fg={palette.faint}>│</text>}
      {screen === "name" ? (
        <NamePrompt
          initialValue={name}
          onSubmit={(value) => {
            setName(value);
            next();
          }}
        />
      ) : null}
      {screen === "packageManager" ? (
        <RadioPrompt
          title="Package manager"
          options={packageManagers.map((value) => ({ value, label: value }))}
          initialValue={packageManager}
          onSelect={(value) => {
            setPackageManager(value);
            next();
          }}
        />
      ) : null}
      {screen === "iconLibrary" ? (
        <RadioPrompt
          title="Icon library"
          options={iconLibraries}
          initialValue={iconLibrary}
          onSelect={(value) => {
            setIconLibrary(value);
            next();
          }}
        />
      ) : null}
      {screen === "font" ? (
        <RadioPrompt
          title="Font"
          options={fonts}
          initialValue={font}
          onSelect={(value) => {
            setFont(value);
            next();
          }}
        />
      ) : null}
      {screen === "features" ? (
        <FeaturesPrompt
          initialValue={features}
          onSubmit={(value) => {
            setFeatures(value);
            setScreen(value.includes("shadcn") ? "shadcnPreset" : "confirm");
          }}
        />
      ) : null}
      {screen === "shadcnPreset" ? (
        <RadioPrompt
          title="shadcn/ui preset"
          options={shadcnPresets}
          initialValue={shadcnPreset}
          onSelect={(value) => {
            setShadcnPreset(value);
            next();
          }}
        />
      ) : null}
      {screen === "confirm" ? <ConfirmPrompt config={config} /> : null}
      {screen === "progress" ? <ProgressTimeline config={config} onExit={exit} /> : null}
    </scrollbox>
  );
}
