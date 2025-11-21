import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

/**
 * Options for the {@link toBeAbove} matcher.
 */
export type ToBeAboveOptions = Tolerance;

/**
 * Asserts that an element is positioned above another element.
 *
 * The element passes if its **bottom edge** is at or above the **top edge** of the reference,
 * within the specified tolerance.
 *
 * - **Strictly above**:
 * ```text
 * ┌───────────────┐
 * │    element    │
 * └───────────────┘
 *         |
 *         ↓
 * ┌───────────────┐
 * │   reference   │
 * └───────────────┘
 * ```
 * - **Touching**:
 * ```text
 * ┌───────────────┐
 * │    element    │
 * └───────────────┘
 * ┌───────────────┐
 * │   reference   │
 * └───────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} that should be above.
 * @param reference - The element as a {@link Locator} that should be below.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Element is strictly above reference (no overlap, no tolerance)
 * await expect(header).toBeAbove(content);
 *
 * @example
 * // Element can overlap reference by up to 10px
 * await expect(title).toBeAbove(subtitle, { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels });
 *
 * @example
 * // Element can overlap reference by up to 5% of reference height
 * await expect(icon).toBeAbove(text, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toBeAbove(
  element: Locator,
  reference: Locator,
  options: ToBeAboveOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * referenceBoundingBox.height : tolerance;
  const delta = referenceBoundingBox.y - (elementBoundingBox.y + elementBoundingBox.height);
  if (delta >= -toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        if (toleranceInPixels === 0) {
          return `Element is strictly above the reference.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is above the reference within ${tolerance}${toleranceUnitSymbol} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      return `Element is not above the reference.

Details:
- Allowed deviation: ≤ ${allowedDeviation}px (${tolerance}${toleranceUnitSymbol})
- Actual deviation:  ${actualDeviation}px

To fix this, move the element upward or increase the tolerance.`;
    },
  };
}
