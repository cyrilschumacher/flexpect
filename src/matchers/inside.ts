import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

function calculateDeltaX(elementBox: BoundingBox, containerBox: BoundingBox, tolerance: number): number {
  const overflowLeft = Math.max(0, containerBox.x - elementBox.x - tolerance);
  const overflowRight = Math.max(
    0,
    elementBox.x + elementBox.width - (containerBox.x + containerBox.width) - tolerance,
  );
  return overflowLeft + overflowRight;
}

function calculateDeltaY(elementBox: BoundingBox, containerBox: BoundingBox, tolerance: number): number {
  const overflowTop = Math.max(0, containerBox.y - elementBox.y - tolerance);
  const overflowBottom = Math.max(
    0,
    elementBox.y + elementBox.height - (containerBox.y + containerBox.height) - tolerance,
  );
  return overflowTop + overflowBottom;
}

/**
 * Options for the {@link toBeInside} matcher.
 */
export type ToBeInsideOptions = Tolerance;

/**
 * Asserts that the target element is fully contained within the specified container element,
 * allowing for an optional margin of tolerance.
 *
 * The check ensures that all sides of the target element (top, bottom, left, right)
 * are strictly within the bounds of the container, with an optional offset based on a
 * percentage of the container's dimensions.
 *
 * @param element - The element as a {@link Locator} to check for containment.
 * @param container - The container element as a {@link Locator} within which the element is expected to be fully contained.
 * @param options - Optional containment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Verify that the modal content is fully inside its container with a 2% tolerance
 * await expect(modalContentLocator).toBeInside(parentLocator, {
 *   tolerance: 2,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 *
 * @example
 * // Verify that the modal content is strictly inside its container without any tolerance
 * await expect(modalContentLocator).toBeInside(parentLocator);
 */
export async function toBeInside(
  element: Locator,
  container: Locator,
  options: ToBeInsideOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const toleranceInPixelsX =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.width * tolerance) / 100 : tolerance;
  const toleranceInPixelsY =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.height * tolerance) / 100 : tolerance;

  const deltaX = calculateDeltaX(elementBoundingBox, containerBoundingBox, toleranceInPixelsX);
  const deltaY = calculateDeltaY(elementBoundingBox, containerBoundingBox, toleranceInPixelsY);

  if (deltaX === 0 && deltaY === 0) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return `Element is properly inside the container.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is properly inside the container with a tolerance of ${tolerance}${toleranceUnitSymbol}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
      const formattedTolerance = tolerance.toFixed(2);
      const toleranceValue =
        toleranceUnit === ToleranceUnit.Percent
          ? `${tolerance}${toleranceUnitSymbol}`
          : `${formattedTolerance}${toleranceUnitSymbol}`;

      const horizontalOverflow = deltaX.toFixed(2);
      const verticalOverflow = deltaY.toFixed(2);
      const allowedToleranceX = toleranceInPixelsX.toFixed(2);
      const allowedToleranceY = toleranceInPixelsY.toFixed(2);

      return `Element is not fully inside the container within the allowed tolerance of ${toleranceValue}.

Details:
- Horizontal overflow: ${horizontalOverflow}px (allowed: ±${allowedToleranceX}px)
- Vertical overflow:   ${verticalOverflow}px (allowed: ±${allowedToleranceY}px)

Please adjust the element's position or size to fit entirely inside the container.`;
    },
  };
}
