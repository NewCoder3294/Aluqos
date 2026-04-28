const MAX_LENGTH = 10_000;

// Zero-width characters and bidirectional formatting frequently used in
// injection / cloaking attacks.
// U+200B ZERO WIDTH SPACE through U+200F RIGHT-TO-LEFT MARK,
// U+202A..U+202E directional formatting (RTL override etc.),
// U+2060 WORD JOINER, U+FEFF ZERO WIDTH NO-BREAK SPACE / BOM.
const ZW_AND_DIRECTIONAL = new RegExp(
  "[\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF]",
  "g",
);

// ASCII control characters except \t (U+0009) and \n (U+000A).
// Strip U+0000-U+0008, U+000B-U+001F, and U+007F (DEL).
const CONTROL_CHARS = new RegExp("[\\x00-\\x08\\x0B-\\x1F\\x7F]", "g");

// More than 5 consecutive whitespace chars is suspicious — collapse.
const LONG_WHITESPACE = /\s{6,}/g;

export function sanitizeUserText(input: string): string {
  let s = input
    .replace(ZW_AND_DIRECTIONAL, "")
    .replace(CONTROL_CHARS, "")
    .replace(LONG_WHITESPACE, " ");
  if (s.length > MAX_LENGTH) s = s.slice(0, MAX_LENGTH);
  return s;
}
