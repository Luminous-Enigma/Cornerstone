// The one source of truth: the CLI, the MCP server and any app call these functions.

/** Raised for bad input; `code` is stable so scripts and agents can rely on it. */
export class InputError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/** "#RGB" or "#RRGGBB" (the # is optional) to [r, g, b] in 0..255. */
export function parseHex(text) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(text).trim());
  if (!m) throw new InputError("BAD_COLOR", `"${text}" is not a hex color like #1A2B3C.`);
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** WCAG 2 relative luminance of a hex color, 0 (black) to 1 (white). */
export function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two colors, 1 to 21. */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Checks text in `foreground` on `background` against WCAG AA. */
export function check(foreground, background, { large = false } = {}) {
  const ratio = contrastRatio(foreground, background);
  const needed = large ? 3 : 4.5;
  return {
    foreground: normalize(foreground),
    background: normalize(background),
    ratio: Math.round(ratio * 100) / 100,
    needed,
    passes: ratio >= needed,
  };
}

function normalize(hex) {
  return "#" + parseHex(hex).map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}
