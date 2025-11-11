import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

function getCenter(boundingBox: BoundingBox) {
  return {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
}

function isWithinTolerance(valueA: number, valueB: number, tolerance: number): boolean {
  return Math.abs(valueA - valueB) <= tolerance;
}

/**
 * Options for the {@link toBeFullyCentered} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToBeFullyCenteredOptions extends Tolerance {}

/**
 * Asserts that the target element is fully centered both horizontally and vertically
 * within the specified container element.
 *
 * ```text
 * |-----------------|
 * |                 |
 * |    [element]    |
 * |                 |
 * |-----------------|
 * ```
 *
 * @param container - The container element as a {@link Locator} relative to which centering is checked.
 * @param options - Optional centering options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Check that a modal is perfectly centered within the viewport, allowing a 2% margin
 * const parentLocator = page.locator('#parent');
 * await expect(modalLocator).toBeFullyCentered(parentLocator, {
 *   tolerance: 2,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toBeFullyCentered(
  element: Locator,
  container: Locator,
  options: ToBeFullyCenteredOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  if (tolerance < 0) {
    throw new Error('tolerance must be greater than or equal to 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const horizontalTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBox.width * tolerance) / 100 : tolerance;
  const verticalTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBox.height * tolerance) / 100 : tolerance;

  const elementCenter = getCenter(elementBox);
  const containerCenter = getCenter(containerBox);

  const horizontallyCentered = isWithinTolerance(containerCenter.x, elementCenter.x, horizontalTolerance);
  const verticallyCentered = isWithinTolerance(containerCenter.y, elementCenter.y, verticalTolerance);
  if (horizontallyCentered && verticallyCentered) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return 'Element is perfectly centered.';
        }

        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        return `Element is perfectly centered with a tolerance of ${tolerance}${unit}.`;
      },
    };
  }

  const horizontalOffset = Math.abs(containerCenter.x - elementCenter.x);
  const verticalOffset = Math.abs(containerCenter.y - elementCenter.y);

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
      return `Element is not fully centered within the container (allowed tolerance: ±${tolerance}${unit}).

Offsets:
- Horizontal: ${horizontalOffset.toFixed(2)}px (tolerance: ±${horizontalTolerance.toFixed(2)}px)
- Vertical:   ${verticalOffset.toFixed(2)}px (tolerance: ±${verticalTolerance.toFixed(2)}px)

Adjust the element position to bring it closer to the container's center.`;
    },
  };
}
