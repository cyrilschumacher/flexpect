import { Locator, MatcherReturnType } from '@playwright/test';
import { rgbToHex, RGBColor, parseToRGB } from './helpers/rgb-to-hex';

async function getComputedBackgroundColor(locator: Locator) {
  const backgroundColor = await locator.evaluate((element: HTMLElement) => {
    const findNonTransparentBackground = (currentElement: HTMLElement | null = element): string => {
      if (currentElement === null) {
        return 'rgb(255, 255, 255)';
      }

      const style = getComputedStyle(currentElement);
      return style.backgroundColor === 'transparent' ||
        (style.backgroundColor === 'rgba(0, 0, 0, 0)' && currentElement.parentElement)
        ? findNonTransparentBackground(currentElement.parentElement)
        : style.backgroundColor;
    };

    return findNonTransparentBackground();
  });

  return parseToRGB(backgroundColor);
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

/**
 * Asserts that the target element has sufficient color contrast between its text color and background color,
 * according to the WCAG 2.1 contrast ratio formula.
 *
 * The matcher calculates the contrast ratio using the relative luminance of the text color and background color.
 * It fails if the contrast ratio is below the specified minimum, as per WCAG 2.1 guidelines (e.g., 4.5:1 for normal text, 3:1 for large text).
 *
 * @param element - The element as a {@link Locator} to check for color contrast.
 * @param minimumContrastRatio - The minimum acceptable contrast ratio (e.g., 4.5 for AA normal text, 3 for AA large text).
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Assert that a button's text has at least a 4.5:1 contrast ratio with its background
 * await expect(buttonLocator).toHaveColorContrast(4.5);
 */
export async function toHaveColorContrast(element: Locator, minimumContrastRatio: number): Promise<MatcherReturnType> {
  const style = await element.evaluate((target) => getComputedStyle(target));

  const textColor = parseToRGB(style.color);
  const textLuminance = computeRelativeLuminance(textColor);
  const backgroundColor = await getComputedBackgroundColor(element);
  const backgroundLuminance = computeRelativeLuminance(backgroundColor);

  const contrastRatio = calculateContrastRatio(textLuminance, backgroundLuminance);
  if (contrastRatio >= minimumContrastRatio) {
    return {
      pass: true,
      message: () => {
        const formattedContrastRatio = contrastRatio.toFixed(2);
        return `Element color contrast is good, with a ratio of ${formattedContrastRatio}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const textColorHex = rgbToHex(textColor);
      const backgroundColorHex = rgbToHex(backgroundColor);

      const actualContrast = contrastRatio.toFixed(2);
      const requiredContrast = minimumContrastRatio.toFixed(0);
      const textLuminanceFormatted = textLuminance.toFixed(4);
      const backgroundLuminanceFormatted = backgroundLuminance.toFixed(4);

      return `Element does not have sufficient color contrast.

Details:
- Actual contrast ratio: ${actualContrast}
- Required contrast ratio: ${requiredContrast}:1
- Text color: ${textColorHex} (Luminance: ${textLuminanceFormatted})
- Background color: ${backgroundColorHex} (Luminance: ${backgroundLuminanceFormatted})

Adjust the text or background color to achieve a contrast ratio of at least ${requiredContrast}:1.`;
    },
  };
}
