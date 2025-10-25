import { Locator, MatcherReturnType } from '@playwright/test';

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

async function getComputedBackgroundColor(locator: Locator) {
  const backgroundColor = await locator.evaluate((element: HTMLElement) => {
    const findNonTransparentBackground = (currentElement: HTMLElement | null = element): string => {
      if (currentElement === null) {
        return 'rgb(255, 255, 255)';
      }

      const style = getComputedStyle(currentElement);
      console.log('Computed style for element:', currentElement, style);
      if (
        (style.backgroundColor === 'rgb(0, 0, 0, 0)' || style.backgroundColor === 'transparent') &&
        currentElement.parentElement
      ) {
        return findNonTransparentBackground(currentElement.parentElement);
      }

      return style.backgroundColor;
    };

    return findNonTransparentBackground();
  });

  return parseColorToRGB(backgroundColor);
}

function parseColorToRGB(color: string): RGBColor {
  console.log('Parsing color:', color);
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match || match[1] === undefined || match[2] === undefined || match[3] === undefined) {
    throw new Error(`Invalid color format: ${color}. Expected rgb(r, g, b).`);
  }

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

function transformSRGBToLinear(channelValue: number) {
  const srgbThreshold = 0.03928;
  const srgbLinearFactor = 12.92;

  if (channelValue <= srgbThreshold) {
    return channelValue / srgbLinearFactor;
  }

  const srgbGammaFactorA = 1.055;
  const srgbGammaFactorB = 0.055;
  const srgbGammaExponent = 2.4;
  return Math.pow((channelValue + srgbGammaFactorB) / srgbGammaFactorA, srgbGammaExponent);
}

function computeRelativeLuminance(color: RGBColor) {
  const { r, g, b } = color;

  const Rs = transformSRGBToLinear(r / 255);
  const Gs = transformSRGBToLinear(g / 255);
  const Bs = transformSRGBToLinear(b / 255);

  const luminanceCoefficientRed = 0.2126;
  const luminanceCoefficientGreen = 0.7152;
  const luminanceCoefficientBlue = 0.0722;

  return luminanceCoefficientRed * Rs + luminanceCoefficientGreen * Gs + luminanceCoefficientBlue * Bs;
}

function calculateContrastRatio(luminance1: number, luminance2: number) {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(color: RGBColor) {
  const { r, g, b } = color;
  return `#${(1 << 24) + (r << 16) + (g << 8) + b}`;
}

/**
 * Asserts that the target element has sufficient color contrast between its text color and background color,
 * according to the WCAG 2.1 contrast ratio formula.
 *
 * The matcher calculates the contrast ratio using the relative luminance of the text color and background color.
 * It fails if the contrast ratio is below the specified minimum, as per WCAG 2.1 guidelines (e.g., 4.5:1 for normal text, 3:1 for large text).
 *
 * @param minimumContrastRatio - The minimum acceptable contrast ratio (e.g., 4.5 for AA normal text, 3 for AA large text).
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Assert that a button's text has at least a 4.5:1 contrast ratio with its background
 * await expect(buttonLocator).toHaveColorContrast(4.5);
 */
export async function toHaveColorContrast(element: Locator, minimumContrastRatio: number): Promise<MatcherReturnType> {
  const style = await element.evaluate((target) => getComputedStyle(target));
  const textColor = parseColorToRGB(style.color);

  const backgroundColor = await getComputedBackgroundColor(element);

  const textLuminance = computeRelativeLuminance(textColor);
  const backgroundLuminance = computeRelativeLuminance(backgroundColor);

  const contrastRatio = calculateContrastRatio(textLuminance, backgroundLuminance);
  if (contrastRatio >= minimumContrastRatio) {
    return {
      pass: true,
      message: () => `Element has sufficient color contrast (ratio: ${contrastRatio.toFixed(2)}).`,
    };
  }

  return {
    pass: false,
    message: () => {
      const textColorHex = rgbToHex(textColor);
      const backgroundColorHex = rgbToHex(backgroundColor);
      return (
        `Element does not have sufficient color contrast.\n\n` +
        `Details:\n` +
        `- Actual contrast ratio: ${contrastRatio.toFixed(2)}\n` +
        `- Required contrast ratio: ${minimumContrastRatio}:1\n` +
        `- Text color: ${textColorHex} (Luminance: ${textLuminance.toFixed(4)})\n` +
        `- Background color: ${backgroundColorHex} (Luminance: ${backgroundLuminance.toFixed(4)})\n\n` +
        `Adjust the text or background color to achieve a contrast ratio of at least ${minimumContrastRatio}:1.`
      );
    },
  };
}
