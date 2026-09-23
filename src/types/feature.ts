export type FeatureId = "typography" | "shadcn" | "motion" | "nuqs" | "tanstackQuery" | "auth";

export type Feature = { id: FeatureId; label: string };

export type FeatureGroup = { title: string; features: Feature[] };
