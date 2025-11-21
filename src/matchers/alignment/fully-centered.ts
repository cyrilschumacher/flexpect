import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from '@helpers/tolerance';

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
export type ToBeFullyCenteredOptions = Tolerance;

/**
 * Asserts that the target element is fully centered both horizontally and vertically
 * within the specified container element.
 *
 * ```text
 * ┌─────────────────┐
 * │                 │
 * │   ┌─────────┐   │
 * │   │ element │   │
 * │   └─────────┘   │
 * │                 │
 * └─────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for centering.
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
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const horizontalTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.width * tolerance) / 100 : tolerance;
  const verticalTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.height * tolerance) / 100 : tolerance;

  const elementCenter = getCenter(elementBoundingBox);
  const containerCenter = getCenter(containerBoundingBox);

  const horizontallyCentered = isWithinTolerance(containerCenter.x, elementCenter.x, horizontalTolerance);
  const verticallyCentered = isWithinTolerance(containerCenter.y, elementCenter.y, verticalTolerance);
  if (horizontallyCentered && verticallyCentered) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return 'Element is perfectly centered.';
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is perfectly centered with a tolerance of ${tolerance}${toleranceUnitSymbol}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const horizontalOffset = Math.abs(containerCenter.x - elementCenter.x);
      const verticalOffset = Math.abs(containerCenter.y - elementCenter.y);

      const formattedHorizontalOffset = horizontalOffset.toFixed(2);
      const formattedVerticalOffset = verticalOffset.toFixed(2);
      const formattedHorizontalTolerance = horizontalTolerance.toFixed(2);
      const formattedVerticalTolerance = verticalTolerance.toFixed(2);

      return `Element is not fully centered within the container (allowed tolerance: ±${tolerance}${toleranceUnitSymbol}).

Details:
- Horizontal: ${formattedHorizontalOffset}px (tolerance: ±${formattedHorizontalTolerance}px)
- Vertical:   ${formattedVerticalOffset}px (tolerance: ±${formattedVerticalTolerance}px)

Adjust the element position to bring it closer to the container's center.`;
    },
  };
}
