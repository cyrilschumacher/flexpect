import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

/**
 * Options for the `toHaveSameSizeAs` matcher.
 */
export interface ToHaveSameSizeAsOptions {
  /**
   * Allowed tolerance for the size difference, expressed as a percentage (%) of the reference element's dimensions.
   *
   * The matcher will pass if both the width and height differences between the target and reference elements
   * are within this percentage.
   *
   * For example, a `tolerancePercent` of 5 means the target element's width and height can differ by up to
   * 5% from the reference element's size without failing the assertion.
   *
   * If omitted, the default tolerance is `0`, requiring exact size equality.
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element has the same width and height as the specified container element.
 *
 * @param container - A `Locator` representing the element to compare size with.
 * @param options - Optional comparison options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the element matches the container’s size, with up to 5% tolerance in width and height
 * await expect(elementLocator).toHaveSameSizeAs(containerLocator, {
 *   tolerancePercent: 5
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
  const { tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const deltaWidth = Math.abs(elementBox.width - containerBox.width);
  const deltaHeight = Math.abs(elementBox.height - containerBox.height);

  if (
    deltaWidth <= (containerBox.width * tolerancePercent) / 100 &&
    deltaHeight <= (containerBox.height * tolerancePercent) / 100
  ) {
    return { pass: true, message: () => 'Element is properly aligned.' };
  }

  return {
    pass: false,
    message: () => {
      const widthTolerance = (containerBox.width * tolerancePercent) / 100;
      const heightTolerance = (containerBox.height * tolerancePercent) / 100;

      return `Expected element to have same size as reference within ${tolerancePercent}% tolerance, but:
- Width: expected ${containerBox.width.toFixed(2)}px ±${widthTolerance.toFixed(2)}px, but received ${elementBox.width.toFixed(2)}px (delta: ${deltaWidth.toFixed(2)}px)
- Height: expected ${containerBox.height.toFixed(2)}px ±${heightTolerance.toFixed(2)}px, but received ${elementBox.height.toFixed(2)}px (delta: ${deltaHeight.toFixed(2)}px)`;
    },
  };
}
