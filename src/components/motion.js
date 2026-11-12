// Easing yang dipakai di seluruh situs (editorial, halus)
export const ease = [0.76, 0, 0.24, 1];
export const easeOut = [0.16, 1, 0.3, 1];

/* Ubah "kata *miring* biasa" menjadi array token:
   [{ text: "kata", italic: false }, { text: "miring", italic: true }, ...] */
export function parseItalic(str) {
  const tokens = [];
  str.split(/(\*[^*]+\*)/g).forEach((part) => {
    if (!part) return;
    const italic = part.startsWith("*") && part.endsWith("*");
    const clean = italic ? part.slice(1, -1) : part;
    clean
      .split(" ")
      .filter(Boolean)
      .forEach((word) => tokens.push({ text: word, italic }));
  });
  return tokens;
}
