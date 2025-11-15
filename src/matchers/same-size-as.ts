import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

/**
 * Options for the {@link toHaveSameSizeAs} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToHaveSameSizeAsOptions extends Tolerance {}

/**
 * Asserts that the target element has the same width and height as the specified container element.
 *
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
  if (tolerance < 0) {
    throw new Error('"tolerance" must be greater than or equal to 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const widthTolerance = toleranceUnit === ToleranceUnit.Percent ? (containerBox.width * tolerance) / 100 : tolerance;
  const heightTolerance = toleranceUnit === ToleranceUnit.Percent ? (containerBox.height * tolerance) / 100 : tolerance;
  const deltaWidth = Math.abs(elementBox.width - containerBox.width);
  const deltaHeight = Math.abs(elementBox.height - containerBox.height);
  if (deltaWidth <= widthTolerance && deltaHeight <= heightTolerance) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return 'Element size matches the container size exactly.';
        }

        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        return `Element size fits the container perfectly with a tolerance of ${tolerance}${unit}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
      return `Element size differs from container size beyond the allowed tolerance of ${tolerance}${unit}.

Details:
- Width:  expected ${containerBox.width.toFixed(2)}px ±${widthTolerance.toFixed(2)}px, got ${elementBox.width.toFixed(2)}px (delta: ${deltaWidth.toFixed(2)}px)
- Height: expected ${containerBox.height.toFixed(2)}px ±${heightTolerance.toFixed(2)}px, got ${elementBox.height.toFixed(2)}px (delta: ${deltaHeight.toFixed(2)}px)

Please adjust the element's size to match the container.`;
    },
  };
}
