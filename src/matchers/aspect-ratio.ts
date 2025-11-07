import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

/**
 * Options for the {@link toHaveAspectRatio} matcher.
 */
export interface ToHaveAspectRatioOptions {
  /**
   * The allowed tolerance for the aspect ratio comparison, expressed as a percentage.
   *
   * This defines how much the actual aspect ratio can differ from the expected ratio while still passing the
   * assertion.
   *
   * Must be strictly greater than 0. Omitting this option defaults to `0`, which
   * will cause the assertion to throw an error because zero tolerance is not allowed.
   *
   * @example
   * { tolerancePercent: 5 } // allows the actual ratio to differ by ±5% from the expected ratio
   *
   * @default 0
   */
  tolerancePercent?: number;
}

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
 *   tolerancePercent: 3,
 * });
 */
export async function toHaveAspectRatio(
  element: Locator,
  expectedRatio: number,
  options: ToHaveAspectRatioOptions = {},
): Promise<MatcherReturnType> {
  const { tolerancePercent = 0 } = options;
  if (tolerancePercent < 0) {
    throw new Error('tolerancePercent must be greater than 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const actualRatio = elementBox.width / elementBox.height;
  const delta = Math.abs(actualRatio - expectedRatio);

  const tolerance = (tolerancePercent / 100) * expectedRatio;
  const lowerBound = expectedRatio - tolerance;
  const upperBound = expectedRatio + tolerance;
  if (actualRatio >= lowerBound && actualRatio <= upperBound) {
    return {
      pass: true,
      message: () =>
        `Element has aspect ratio within ${tolerancePercent}% tolerance: expected ≈ ${expectedRatio.toFixed(4)}, actual ${actualRatio.toFixed(4)} (delta ${delta.toFixed(4)}).`,
    };
  }

  return {
    pass: false,
    message: () => {
      const expectedRatioFormatted = expectedRatio.toFixed(4);
      const actualRatioFormatted = actualRatio.toFixed(4);
      const difference = delta.toFixed(4);
      const allowed = tolerance.toFixed(4);

      return `Element's aspect ratio is outside the allowed ${tolerancePercent}% range.

Details:
- Expected ratio: ~${expectedRatioFormatted}
- Actual ratio:   ${actualRatioFormatted}
- Difference:     ${difference} (allowed: ±${allowed})

To fix this, adjust the element's width or height so that its ratio more closely matches the expected ${expectedRatioFormatted}.`;
    },
  };
}
