import type { Feature, FeatureGroup, FeatureId } from "@/types/feature";

export const featureGroups: FeatureGroup[] = [
  {
    title: "Styling",
    features: [
      { id: "typography", label: "Tailwind Typography" },
      { id: "shadcn", label: "Shadcn/UI (base-ui, all components)" },
    ],
  },
  {
    title: "Libraries",
    features: [
      { id: "motion", label: "Motion (framer-motion)" },
      { id: "tanstackQuery", label: "TanStack Query (provider + devtools)" },
      { id: "nuqs", label: "nuqs (URL search-param state)" },
    ],
  },
  {
    title: "Auth",
    features: [{ id: "auth", label: "Better Auth + Member dashboard (Google + GitHub, /sign-in, /dashboard)" }],
  },
];

export const allFeatures: Feature[] = featureGroups.flatMap((group) => group.features);

export const defaultFeatureIds: FeatureId[] = allFeatures.map((feature) => feature.id);
