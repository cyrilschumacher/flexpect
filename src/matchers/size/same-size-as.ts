import { Locator, MatcherReturnType } from '@playwright/test';

import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from '@helpers/tolerance';

/**
 * Options for the {@link toHaveSameSizeAs} matcher.
 */
export type ToHaveSameSizeAsOptions = Tolerance;

/**
 * Asserts that the target element has the same width and height as the specified container element.
 *
 * @param element - The element as a {@link Locator} to check for size.
 * @param container - A `Locator` representing the element to compare size with.
 * @param options - Optional comparison options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the element matches the container's size, with up to 5% tolerance in width and height
 * await expect(elementLocator).toHaveSameSizeAs(containerLocator, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 *
 * @example
 * // Checks that the element has exactly the same width and height as its container using default alignment options
 * await expect(elementLocator).toHaveSameSizeAs(containerLocator);
 */
export async function toHaveSameSizeAs(
  element: Locator,
  container: Locator,
  options: ToHaveSameSizeAsOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const widthTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.width * tolerance) / 100 : tolerance;
  const heightTolerance =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.height * tolerance) / 100 : tolerance;
  const deltaWidth = Math.abs(elementBoundingBox.width - containerBoundingBox.width);
  const deltaHeight = Math.abs(elementBoundingBox.height - containerBoundingBox.height);
  if (deltaWidth <= widthTolerance && deltaHeight <= heightTolerance) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return 'Element size matches the container size exactly.';
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element size fits the container perfectly with a tolerance of ${tolerance}${toleranceUnitSymbol}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
      return `Element size differs from container size beyond the allowed tolerance of ${tolerance}${toleranceUnitSymbol}.

Details:
- Width:  expected ${containerBoundingBox.width.toFixed(2)}px ±${widthTolerance.toFixed(2)}px, got ${elementBoundingBox.width.toFixed(2)}px (delta: ${deltaWidth.toFixed(2)}px)
- Height: expected ${containerBoundingBox.height.toFixed(2)}px ±${heightTolerance.toFixed(2)}px, got ${elementBoundingBox.height.toFixed(2)}px (delta: ${deltaHeight.toFixed(2)}px)

Please adjust the element's size to match the container.`;
    },
  };
}
