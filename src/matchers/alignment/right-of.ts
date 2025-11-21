import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from '@helpers/tolerance';

/**
 * Options for the {@link toBeRightOf} matcher.
 */
export type ToBeRightOfOptions = Tolerance;

/**
 * Asserts that an element is positioned to the right of another element.
 *
 * The element passes if its **left edge** is at or to the right of the **right edge** of the reference,
 * within the specified tolerance.
 *
 * - **Strictly to the right**:
 * ```text
 * ┌───────────────┐         ┌───────────────┐
 * │   reference   │         │    element    │
 * └───────────────┘         └───────────────┘
 *         |                         |
 *         ←─────────────────────────→
 * ```
 * - **Touching**:
 * ```text
 * ┌───────────────┐┌───────────────┐
 * │   reference   ││    element    │
 * └───────────────┘└───────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} that should be to the right.
 * @param reference - The element as a {@link Locator} that should be to the left.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Element is strictly to the right of reference (no overlap, no tolerance)
 * await expect(content).toBeRightOf(sidebar);
 *
 * @example
 * // Element can overlap reference by up to 10px
 * await expect(text).toBeRightOf(icon, { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels });
 *
 * @example
 * // Element can overlap reference by up to 5% of reference width
 * await expect(input).toBeRightOf(label, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toBeRightOf(
  element: Locator,
  reference: Locator,
  options: ToBeRightOfOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * referenceBoundingBox.width : tolerance;
  const delta = elementBoundingBox.x - (referenceBoundingBox.x + referenceBoundingBox.width);

  if (delta >= -toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        if (toleranceInPixels === 0) {
          return `Element is strictly to the right of the reference.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is to the right of the reference within ${tolerance}${toleranceUnitSymbol} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);

      return `Element is not to the right of the reference.

Details:
- Allowed deviation: ≤ ${allowedDeviation}px (${tolerance}${toleranceUnitSymbol})
- Actual deviation:  ${actualDeviation}px

To fix this, move the element rightward or increase the tolerance.`;
    },
  };
}
