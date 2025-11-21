import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

/**
 * Options for the {@link toBeBelow} matcher.
 */
export type ToBeBelowOptions = Tolerance;

/**
 * Asserts that an element is positioned below another element.
 *
 * The element passes if its **top edge** is at or below the **bottom edge** of the reference,
 * within the specified tolerance.
 *
 * - **Strictly below**:
 * ```text
 * ┌───────────────┐
 * │   reference   │
 * └───────────────┘
 *         |
 *         ↓
 * ┌───────────────┐
 * │    element    │
 * └───────────────┘
 * ```
 * - **Touching**:
 * ```text
 * ┌───────────────┐
 * │   reference   │
 * └───────────────┘
 * ┌───────────────┐
 * │    element    │
 * └───────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} that should be below.
 * @param reference - The element as a {@link Locator} that should be above.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Element is strictly below reference (no overlap, no tolerance)
 * await expect(content).toBeBelow(header);
 *
 * @example
 * // Element can overlap reference by up to 10px
 * await expect(subtitle).toBeBelow(title, { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels });
 *
 * @example
 * // Element can overlap reference by up to 5% of reference height
 * await expect(text).toBeBelow(icon, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toBeBelow(
  element: Locator,
  reference: Locator,
  options: ToBeBelowOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * referenceBoundingBox.height : tolerance;
  const delta = elementBoundingBox.y - (referenceBoundingBox.y + referenceBoundingBox.height);
  if (delta >= -toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        if (toleranceInPixels === 0) {
          return `Element is strictly below the reference.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is below the reference within ${tolerance}${toleranceUnitSymbol} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);

      return `Element is not below the reference.

Details:
- Allowed deviation: ≤ ${allowedDeviation}px (±${tolerance}${toleranceUnitSymbol})
- Actual deviation:  ${actualDeviation}px

To fix this, move the element downward or increase the tolerance.`;
    },
  };
}
