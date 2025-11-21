import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

/**
 * Asserts that the target element fits entirely within the bounds of the specified container element.
 * The check ensures that all sides of the target element (top, bottom, left, right) are strictly within
 * the bounds of the container, with no partial overlap allowed.
 *
 * - **Perfect Fit** (Pass):
 * ```text
 * ┌─────────────────────┐
 * │┌───────────────────┐│
 * ││                   ││
 * ││      Element      ││
 * ││   (Perfect Fit)   ││
 * ││                   ││
 * │└───────────────────┘│
 * └─────────────────────┘
 * ```
 * - **Position Mismatch** (Fail):
 * ```text
 * ┌──────────────────────┐
 * │                      │
 * │ ┌──────────────────┐ │
 * │ │     Element      │ │
 * │ │ (Wrong Position) │ │
 * │ └──────────────────┘ │
 * └──────────────────────┘
 * ```
 * - **Size Mismatch** (Fail):
 * ```text
 * ┌─────────────────────┐
 * │   ┌─────────────┐   │
 * │   │   Element   │   │
 * │   │ (Too Small) │   │
 * │   └─────────────┘   │
 * └─────────────────────┘
 * ```
 * - **Overflow** (Fail):
 * ```text
 * ┌─────────────────────┐
 * │┌────────────────────┼─┐
 * ││       Element      │ │
 * ││      (Overflow)    │ │
 * │└────────────────────┼─┘
 * └─────────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for fitting within the container.
 * @param container - The container element as a {@link Locator} within which the element is expected to fit.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * await expect(locator).toFitContainer(parentLocator);
 */
export async function toFitContainer(element: Locator, container: Locator): Promise<MatcherReturnType> {
  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  if (
    elementBox.x === containerBox.x &&
    elementBox.y === containerBox.y &&
    elementBox.width === containerBox.width &&
    elementBox.height === containerBox.height
  ) {
    return { pass: true, message: () => 'Element fits exactly within container.' };
  }

  return {
    pass: false,
    message: () => {
      const posXDiff = elementBox.x - containerBox.x;
      const posYDiff = elementBox.y - containerBox.y;
      const widthDiff = elementBox.width - containerBox.width;
      const heightDiff = elementBox.height - containerBox.height;

      const horizontalPositionDelta = posXDiff.toFixed(2);
      const verticalPositionDelta = posYDiff.toFixed(2);
      const widthSizeDelta = widthDiff.toFixed(2);
      const heightSizeDelta = heightDiff.toFixed(2);

      return `Element does not fit exactly within the container.

Details:
- Position delta: x = ${horizontalPositionDelta}px, y = ${verticalPositionDelta}px
- Size delta:     width = ${widthSizeDelta}px, height = ${heightSizeDelta}px

Please ensure the element's position and size exactly match the container's.`;
    },
  };
}
