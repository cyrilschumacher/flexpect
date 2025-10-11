import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

/**
 * Asserts that the target element fits entirely within the bounds of the specified container element.
 * The check ensures that all sides of the target element (top, bottom, left, right)
 * are strictly within the bounds of the container, with no partial overlap allowed.
 *
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

      return (
        `Element does not fit exactly within the container.\n\n` +
        `Differences:\n` +
        `- Position delta: x = ${posXDiff.toFixed(2)}px, y = ${posYDiff.toFixed(2)}px\n` +
        `- Size delta: width = ${widthDiff.toFixed(2)}px, height = ${heightDiff.toFixed(2)}px\n\n` +
        `Please ensure the element's position and size exactly match the container's.`
      );
    },
  };
}
