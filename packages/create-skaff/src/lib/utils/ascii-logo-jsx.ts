import { fonts } from "@opentui/core";

const font = fonts.block;
const glyphs: Partial<Record<string, string[]>> = font.chars;

// opentui's block font marks its two color channels with <c1>/<c2> tags; each becomes a span.
export function asciiLogoJsx(text: string, indent: string): string {
  const lines = Array.from({ length: font.lines }, (_, row) =>
    [...text.toUpperCase()]
      .map((char) => {
        const glyph = glyphs[char];
        if (!glyph) {
          throw new Error(`The block font has no glyph for "${char}"`);
        }
        return glyph[row];
      })
      .join(font.letterspace[row] ?? ""),
  );
  return lines
    .map((line) => {
      const spans = [...line.matchAll(/<(c\d)>([^<]*)<\/\1>|([^<]+)/g)]
        .map(([, channel, inner, plain]) =>
          channel
            ? `<span className="${channel === "c1" ? "text-foreground" : "text-muted-foreground"}">{${JSON.stringify(inner)}}</span>`
            : `{${JSON.stringify(plain)}}`,
        )
        .join("");
      return `${indent}${spans}`;
    })
    .join(`{"\\n"}\n`);
}
