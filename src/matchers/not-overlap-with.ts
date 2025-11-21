import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

/**
 * Asserts that the target element does not overlap with the reference element.
 *
 * This matcher checks whether the bounding boxes of the target element and the reference
 * element intersect. If there is any overlap, the matcher fails and provides detailed
 * information about the intersection area and dimensions.
 *
 * The function is useful for verifying layout constraints where elements should remain
 * visually separated, such as avoiding collisions between buttons, modals, or other UI components.
 *
 * @param element - The element as a {@link Locator} whose overlap is checked.
 * @param reference - The element as a {@link Locator} relative to which overlap is checked.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that a tooltip does not overlap a button
 * await expect(tooltip).toNotOverlapWith(button);
 */
export async function toNotOverlapWith(element: Locator, reference: Locator): Promise<MatcherReturnType> {
  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const noOverlap =
    elementBoundingBox.x + elementBoundingBox.width <= referenceBoundingBox.x ||
    referenceBoundingBox.x + referenceBoundingBox.width <= elementBoundingBox.x ||
    elementBoundingBox.y + elementBoundingBox.height <= referenceBoundingBox.y ||
    referenceBoundingBox.y + referenceBoundingBox.height <= elementBoundingBox.y;

  if (noOverlap) {
    return {
      pass: true,
      message: () => `Elements do not overlap within the expected layout boundaries.`,
    };
  }

  return {
    pass: false,
    message: () => {
      const leftOverlap = Math.max(elementBoundingBox.x, referenceBoundingBox.x);
      const rightOverlap = Math.min(
        elementBoundingBox.x + elementBoundingBox.width,
        referenceBoundingBox.x + referenceBoundingBox.width,
      );
      const xOverlap = Math.max(0, rightOverlap - leftOverlap);

      const topOverlap = Math.max(elementBoundingBox.y, referenceBoundingBox.y);
      const bottomOverlap = Math.min(
        elementBoundingBox.y + elementBoundingBox.height,
        referenceBoundingBox.y + referenceBoundingBox.height,
      );
      const yOverlap = Math.max(0, bottomOverlap - topOverlap);

      const intersectionArea = xOverlap * yOverlap;
      const overlapWidth = xOverlap.toFixed(2);
      const overlapHeight = yOverlap.toFixed(2);

      return `Elements overlap unexpectedly.

Details:
- Intersection area: ${intersectionArea.toFixed(2)}px²
- Overlap width:     ${overlapWidth}px
- Overlap height:    ${overlapHeight}px

Adjust the layout or positioning to ensure the elements do not overlap.`;
    },
  };
}
