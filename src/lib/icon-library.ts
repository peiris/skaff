import type { IconLibrary, IconLibraryMeta } from "@/types/icon-library";

export const iconLibraryMeta: Record<IconLibrary, IconLibraryMeta> = {
  lucide: { label: "Lucide", description: "lucide-react", packages: ["lucide-react"] },
  hugeicons: {
    label: "Hugeicons",
    description: "@hugeicons/react + free icons",
    packages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
};

export const iconLibraries = (Object.keys(iconLibraryMeta) as IconLibrary[]).map((value) => ({
  value,
  label: iconLibraryMeta[value].label,
  description: iconLibraryMeta[value].description,
}));
