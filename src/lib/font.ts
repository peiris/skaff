import type { Font, FontMeta } from "@/types/font";

export const fontMeta: Record<Font, FontMeta> = {
  geist: { label: "Geist", googleExport: "Geist" },
  inter: { label: "Inter", googleExport: "Inter" },
  "noto-sans": { label: "Noto Sans", googleExport: "Noto_Sans" },
  roboto: { label: "Roboto", googleExport: "Roboto" },
  "public-sans": { label: "Public Sans", googleExport: "Public_Sans" },
  "ibm-plex-sans": { label: "IBM Plex Sans", googleExport: "IBM_Plex_Sans" },
  "instrument-sans": { label: "Instrument Sans", googleExport: "Instrument_Sans" },
  "jetbrains-mono": { label: "JetBrains Mono", googleExport: "JetBrains_Mono" },
  "geist-mono": { label: "Geist Mono", googleExport: "Geist_Mono" },
};

export const fonts = (Object.keys(fontMeta) as Font[]).map((value) => ({ value, label: fontMeta[value].label }));
