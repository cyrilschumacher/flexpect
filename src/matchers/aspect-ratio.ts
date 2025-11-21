import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

/**
 * Options for the {@link toHaveAspectRatio} matcher.
 */
export type ToHaveAspectRatioOptions = Tolerance;

/**
 * Asserts that the target element has the specified aspect ratio (width divided by height),
 * within an optional tolerance percentage.
 *
 * This assertion calculates the aspect ratio of the element by dividing its width by its height,
 * then compares it to the expected ratio. If the actual ratio falls outside the allowed tolerance,
 * a detailed message is returned to help diagnose the discrepancy.
 *
 * The aspect ratio is defined as:
 * ```text
 * aspectRatio = width / height
 * ```
 *
 * @param element - The element as a {@link Locator} to check for aspect ratio.
 * @param expectedRatio - The expected aspect ratio (width / height) to check against.
 * @param options - Optional comparison options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the element has an aspect ratio of 16:9 exactly (no tolerance)
 * await expect(elementLocator).toHaveAspectRatio(16 / 9);
 *
 * @example
 * // Checks that the element has an aspect ratio close to 4:3 within 3% tolerance
 * await expect(elementLocator).toHaveAspectRatio(4 / 3, {
 *   tolerance: 3,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toHaveAspectRatio(
  element: Locator,
  expectedRatio: number,
  options: ToHaveAspectRatioOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBox = await getBoundingBoxOrFail(element);
  const actualRatio = elementBox.width / elementBox.height;
  const delta = Math.abs(actualRatio - expectedRatio);

  const toleranceInPixels = toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * expectedRatio : tolerance;
  const lowerBound = expectedRatio - toleranceInPixels;
  const upperBound = expectedRatio + toleranceInPixels;

  if (actualRatio >= lowerBound && actualRatio <= upperBound) {
    return {
      pass: true,
      message: () => {
        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        const formattedExpected = expectedRatio.toFixed(4);
        const formattedActual = actualRatio.toFixed(4);
        const formattedDelta = delta.toFixed(4);
        if (tolerance === 0) {
          return `Element aspect ratio matches the expected value exactly, with ${actualRatio.toFixed(4)} actual and ${expectedRatio.toFixed(4)} expected.`;
        }

        return `Element aspect ratio is within ${tolerance}${toleranceUnitSymbol} of the expected value, with ${formattedActual} actual, ${formattedExpected} expected, and an offset of ${formattedDelta}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const expectedRatioFormatted = expectedRatio.toFixed(4);
      const actualRatioFormatted = actualRatio.toFixed(4);
      const difference = delta.toFixed(4);
      const allowedDifference = toleranceInPixels.toFixed(4);

      return `Element's aspect ratio is outside the allowed ${tolerance}${toleranceUnitSymbol} range.

Details:
- Expected ratio: ~${expectedRatioFormatted}
- Actual ratio:   ${actualRatioFormatted}
- Difference:     ${difference} (allowed: ±${allowedDifference})

To fix this, adjust the element's width or height so that its ratio more closely matches the expected ${expectedRatioFormatted}.`;
    },
  };
}
