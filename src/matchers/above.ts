import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

/**
 * Options for the {@link toBeAbove} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToBeAboveOptions extends Tolerance {}

/**
 * Asserts that an element is positioned above another element.
 *
 * The element passes if its **bottom edge** is at or above the **top edge** of the reference,
 * within the specified tolerance.
 *
 * - **Strictly above** (tolerance = 0):
 * * ```text
 * ┌───────────────┐
 * │    element    │
 * └───────────────┘
 *         |
 *         ↓
 * ┌───────────────┐
 * │   reference   │
 * └───────────────┘
 * ```
 * - **Touching** (allowed with tolerance = 0):
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
  if (tolerance < 0) {
    throw new Error('tolerance must be greater than or equal to 0');
  }

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

        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        return `Element is above the reference within ${tolerance}${unit} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);

      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';

      return `Element is not above the reference.

Details:
- Allowed deviation: ≤ ${allowedDeviation}px (${tolerance}${unit})
- Actual deviation:  ${actualDeviation}px

To fix this, move the element upward or increase the tolerance.`;
    },
  };
}
