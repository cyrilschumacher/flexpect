function toHex(value: number): string {
  const clamped = Math.max(0, Math.min(255, value));
  const hex = clamped.toString(16).padStart(2, '0');

  return hex.toUpperCase();
}

/** @internal */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/** @internal */
export function rgbToHex(color: RGBColor): string {
  const { r, g, b } = color;

  const redHex = toHex(r);
  const greenHex = toHex(g);
  const blueHex = toHex(b);

  return `#${redHex}${greenHex}${blueHex}`;
}

/** @internal */
export function parseToRGB(str: string): RGBColor {
  const match = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (!match || match[1] === undefined || match[2] === undefined || match[3] === undefined) {
    throw new Error(`Invalid color format: ${str}. Expected rgb(r, g, b).`);
  }

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}
