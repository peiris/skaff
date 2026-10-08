import type { IconLibrary, IconLibraryMeta } from "@/types/icon-library";

export const iconLibraryMeta: Record<IconLibrary, IconLibraryMeta> = {
  lucide: { label: "Lucide", description: "lucide-react", url: "https://lucide.dev", packages: ["lucide-react"] },
  hugeicons: {
    label: "Hugeicons",
    description: "@hugeicons/react + free icons",
    url: "https://hugeicons.com",
    packages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
};

export const iconLibraries = (Object.keys(iconLibraryMeta) as IconLibrary[]).map((value) => ({
  value,
  label: iconLibraryMeta[value].label,
  description: iconLibraryMeta[value].description,
}));
