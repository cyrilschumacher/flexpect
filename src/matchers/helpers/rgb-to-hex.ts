function toHex(value: number): string {
  const clamped = Math.max(0, Math.min(255, value));
  const hex = clamped.toString(16).padStart(2, '0');

  return hex.toUpperCase();
}

function validateAlphaValue(alphaValue: string) {
  const alphaNumberValue = parseInt(alphaValue, 10);
  if (isNaN(alphaNumberValue) || alphaNumberValue < 0 || alphaNumberValue > 255) {
    throw new Error(`Invalid alpha value: ${alphaValue}. Expected a number between 0 and 255.`);
  }

  return alphaNumberValue;
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
  if (!match || match.length < 4) {
    throw new Error(`Invalid color format: ${str}. Expected rgb(r, g, b).`);
  }

  const [, rStr, gStr, bStr] = match;
  const r = validateAlphaValue(rStr as string);
  const g = validateAlphaValue(gStr as string);
  const b = validateAlphaValue(bStr as string);

  return { r, g, b };
}
