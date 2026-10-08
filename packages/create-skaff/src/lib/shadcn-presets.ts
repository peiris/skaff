import type { Font } from "@/types/font";
import type { IconLibrary } from "@/types/icon-library";
import type { ShadcnPreset, ShadcnPresetMeta } from "@/types/shadcn-preset";

export const shadcnPresetMeta: Record<ShadcnPreset, ShadcnPresetMeta> = {
  maia: { label: "Maia", baseColor: "neutral" },
  nova: { label: "Nova", baseColor: "neutral" },
  vega: { label: "Vega", baseColor: "neutral" },
  lyra: { label: "Lyra", baseColor: "neutral" },
  mira: { label: "Mira", baseColor: "neutral" },
  luma: { label: "Luma", baseColor: "neutral" },
  sera: { label: "Sera", baseColor: "taupe", fontHeading: "playfair-display" },
  rhea: { label: "Rhea", baseColor: "neutral" },
};

export const shadcnPresets = (Object.keys(shadcnPresetMeta) as ShadcnPreset[]).map((value) => ({
  value,
  label: shadcnPresetMeta[value].label,
}));

// shadcn init has no icon-library or font flags; a named preset is expanded internally to this
// /init URL, so passing the URL with iconLibrary and font swapped is the only way to override them.
export function shadcnPresetUrl(preset: ShadcnPreset, iconLibrary: IconLibrary, font: Font): string {
  const { baseColor, fontHeading } = shadcnPresetMeta[preset];
  const params = new URLSearchParams({
    base: "base",
    style: preset,
    baseColor,
    theme: baseColor,
    iconLibrary,
    font,
    rtl: "false",
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    template: "next",
  });
  if (baseColor !== "neutral") {
    params.set("chartColor", baseColor);
  }
  if (fontHeading) {
    params.set("fontHeading", fontHeading);
  }
  return `https://ui.shadcn.com/init?${params.toString()}`;
}
