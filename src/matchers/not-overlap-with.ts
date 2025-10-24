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
 * @param target - The element as a {@link Locator} whose overlap is checked.
 * @param reference - The element as a {@link Locator} relative to which overlap is checked.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that a tooltip does not overlap a button
 * await expect(tooltip).toNotOverlapWith(button);
 */
export async function toNotOverlapWith(target: Locator, reference: Locator): Promise<MatcherReturnType> {
  const targetBox = await getBoundingBoxOrFail(target);
  const referenceBox = await getBoundingBoxOrFail(reference);

  const noOverlap =
    targetBox.x + targetBox.width <= referenceBox.x ||
    referenceBox.x + referenceBox.width <= targetBox.x ||
    targetBox.y + targetBox.height <= referenceBox.y ||
    referenceBox.y + referenceBox.height <= targetBox.y;

  if (noOverlap) {
    return {
      pass: true,
      message: () => `Elements do not overlap within the expected layout boundaries.`,
    };
  }

  return {
    pass: false,
    message: () => {
      const leftOverlap = Math.max(targetBox.x, referenceBox.x);
      const rightOverlap = Math.min(targetBox.x + targetBox.width, referenceBox.x + referenceBox.width);
      const xOverlap = Math.max(0, rightOverlap - leftOverlap);

      const topOverlap = Math.max(targetBox.y, referenceBox.y);
      const bottomOverlap = Math.min(targetBox.y + targetBox.height, referenceBox.y + referenceBox.height);
      const yOverlap = Math.max(0, bottomOverlap - topOverlap);

      const intersectionArea = xOverlap * yOverlap;

      return (
        `Elements overlap unexpectedly.\n\n` +
        `Details:\n` +
        `- Intersection area: ${intersectionArea.toFixed(2)}px²\n` +
        `- Overlap width:     ${xOverlap.toFixed(2)}px\n` +
        `- Overlap height:    ${yOverlap.toFixed(2)}px\n\n` +
        `Element A: x=${targetBox.x}, y=${targetBox.y}, width=${targetBox.width}, height=${targetBox.height}\n` +
        `Element B: x=${referenceBox.x}, y=${referenceBox.y}, width=${referenceBox.width}, height=${referenceBox.height}\n\n` +
        `Adjust the layout or positioning to ensure the elements do not overlap.`
      );
    },
  };
}
