import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

/**
 * Options for the {@link toHaveAspectRatio} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToHaveAspectRatioOptions extends Tolerance {}

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
  if (tolerance < 0) {
    throw new Error('tolerance must be greater than or equal to 0');
  }

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
        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';

        const formattedExpected = expectedRatio.toFixed(4);
        const formattedActual = actualRatio.toFixed(4);
        const formattedDelta = delta.toFixed(4);

        return `Element's aspect ratio is within ${tolerance}${unit} tolerance: ${formattedActual} (actual) vs ≈ ${formattedExpected} (expected), off by ${formattedDelta}.`;
      },
    };
  }

  const expectedRatioFormatted = expectedRatio.toFixed(4);
  const actualRatioFormatted = actualRatio.toFixed(4);
  const difference = delta.toFixed(4);
  const allowed = toleranceInPixels.toFixed(4);

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
      return `Element's aspect ratio is outside the allowed ${tolerance}${unit} range.

Details:
- Expected ratio: ~${expectedRatioFormatted}
- Actual ratio:   ${actualRatioFormatted}
- Difference:     ${difference} (allowed: ±${allowed})

To fix this, adjust the element's width or height so that its ratio more closely matches the expected ${expectedRatioFormatted}.`;
    },
  };
}
