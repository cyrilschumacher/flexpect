import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

/**
 * Options for the {@link toBeLeftOf} matcher.
 */
export type ToBeLeftOfOptions = Tolerance;

/**
 * Asserts that an element is positioned to the left of another element.
 *
 * The element passes if its **right edge** is at or to the left of the **left edge** of the reference,
 * within the specified tolerance.
 *
 * - **Strictly to the left**:
 * ```text
 * ┌───────────────┐         ┌───────────────┐
 * │    element    │         │   reference   │
 * └───────────────┘         └───────────────┘
 *         |                         |
 *         ←─────────────────────────→
 * ```
 * - **Touching**:
 * ```text
 * ┌───────────────┐┌───────────────┐
 * │    element    ││   reference   │
 * └───────────────┘└───────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} that should be to the left.
 * @param reference - The element as a {@link Locator} that should be to the right.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Element is strictly to the left of reference (no overlap, no tolerance)
 * await expect(sidebar).toBeLeftOf(content);
 *
 * @example
 * // Element can overlap reference by up to 10px
 * await expect(icon).toBeLeftOf(text, { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels });
 *
 * @example
 * // Element can overlap reference by up to 5% of reference width
 * await expect(label).toBeLeftOf(input, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toBeLeftOf(
  element: Locator,
  reference: Locator,
  options: ToBeLeftOfOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * referenceBoundingBox.width : tolerance;
  const delta = referenceBoundingBox.x - (elementBoundingBox.x + elementBoundingBox.width);
  if (delta >= -toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        if (toleranceInPixels === 0) {
          return `Element is strictly to the left of the reference.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is to the left of the reference within ${tolerance}${toleranceUnitSymbol} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);

      return `Element is not to the left of the reference.

Details:
- Allowed deviation: ≤ ${allowedDeviation}px (${tolerance}${toleranceUnitSymbol})
- Actual deviation:  ${actualDeviation}px

To fix this, move the element leftward or increase the tolerance.`;
    },
  };
}
