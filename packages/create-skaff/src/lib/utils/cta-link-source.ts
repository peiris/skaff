import type { CtaLink } from "@/types/cta-link";

const plainClass = {
  primary: "rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background",
  outline: "rounded-md border px-4 py-2 text-sm font-medium",
};

// Emitted into a generated project; with shadcn the Button renders a Link, otherwise the Link
// carries the equivalent classes. oxfmt reformats the output, so indentation here is cosmetic.
export function ctaLinkSource(shadcn: boolean, { href, label, variant }: CtaLink): string {
  if (shadcn) {
    const variantProp = variant === "outline" ? ' variant="outline"' : "";
    return `<Button${variantProp} nativeButton={false} render={<Link href="${href}" />}>
            ${label}
          </Button>`;
  }
  return `<Link href="${href}" className="${plainClass[variant]}">
            ${label}
          </Link>`;
}
