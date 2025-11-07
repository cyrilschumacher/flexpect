import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

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
export interface ToBeInsideOptions {
  /**
   * Allowed tolerance for the containment check, expressed as a percentage (%) of the container's width.
   *
   * This value defines the margin by which the target element can extend beyond the container's horizontal boundaries
   * while still being considered "inside".
   *
   * Must be strictly greater than 0. Omitting this option defaults to `0`, which
   * will cause the assertion to throw an error because zero tolerance is not allowed.
   *
   * @example
   * { tolerancePercent: 5 } // allows the element to exceed the container's width by up to 5%
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element is fully contained within the specified container element,
 * allowing for an optional margin of tolerance.
 *
 * The check ensures that all sides of the target element (top, bottom, left, right)
 * are strictly within the bounds of the container, with an optional offset based on a
 * percentage of the container's dimensions.
 *
 * @param container - The container element as a {@link Locator} within which the element is expected to be fully contained.
 * @param options - Optional containment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Verify that the modal content is fully inside its container with a 2% tolerance
 * await expect(modalContentLocator).toBeInside(parentLocator, {
 *   tolerancePercent: 2
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
  const { tolerancePercent = 0 } = options;
  if (tolerancePercent < 0) {
    throw new Error('tolerancePercent must be greater than 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const tolerance = (containerBox.width * tolerancePercent) / 100;
  const deltaX = calculateDeltaX(elementBox, containerBox, tolerance);
  const deltaY = calculateDeltaY(elementBox, containerBox, tolerance);
  if (deltaX === 0 && deltaY === 0) {
    return {
      pass: true,
      message: () => `Element is properly inside the container within the allowed tolerance (${tolerancePercent}%).`,
    };
  }

  return {
    pass: false,
    message: () => {
      const horizontalOverflow = deltaX.toFixed(2);
      const verticalOverflow = deltaY.toFixed(2);
      const allowedTolerance = tolerance.toFixed(2);

      return `Element is not fully inside the container within the allowed tolerance of ${tolerancePercent}%.

Details:
- Horizontal overflow: ${horizontalOverflow}px
- Vertical overflow:   ${verticalOverflow}px
- Allowed tolerance:   ±${allowedTolerance}px

Please adjust the element's position or size to fit entirely inside the container.`;
    },
  };
}
