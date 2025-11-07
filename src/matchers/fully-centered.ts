import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

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
export interface ToBeFullyCenteredOptions {
  /**
   * Allowed tolerance for the centering difference, expressed as a percentage (%).
   *
   * The matcher will pass if the element is centered within this percentage tolerance
   * relative to the container or reference element.
   *
   * Must be strictly greater than 0. Omitting this option defaults to `0`, which
   * will cause the assertion to throw an error because zero tolerance is not allowed.
   *
   * @example
   * { tolerancePercent: 5 } // allows centering to be off by up to 5%
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element is fully centered both horizontally and vertically
 * within the specified container element.
 *
 * ```text
 * |-----------------|
 * |                 |
 * |    [element]    |
 * |                 |
 * |-----------------|
 * ```
 *
 * @param container - The container element as a {@link Locator} relative to which centering is checked.
 * @param options - Optional centering options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Check that a modal is perfectly centered within the viewport, allowing a 2% margin
 * const parentLocator = page.locator('#parent');
 * await expect(modalLocator).toBeFullyCentered(parentLocator, {
 *   tolerancePercent: 2
 * });
 */
export async function toBeFullyCentered(
  element: Locator,
  container: Locator,
  options: ToBeFullyCenteredOptions = {},
): Promise<MatcherReturnType> {
  const { tolerancePercent = 0 } = options;
  if (tolerancePercent < 0) {
    throw new Error('tolerancePercent must be greater than 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const horizontalTolerance = (containerBox.width * tolerancePercent) / 100;
  const verticalTolerance = (containerBox.height * tolerancePercent) / 100;
  const elementCenter = getCenter(elementBox);
  const containerCenter = getCenter(containerBox);

  const horizontallyCentered = isWithinTolerance(containerCenter.x, elementCenter.x, horizontalTolerance);
  const verticallyCentered = isWithinTolerance(containerCenter.y, elementCenter.y, verticalTolerance);
  if (horizontallyCentered && verticallyCentered) {
    return {
      pass: true,
      message: () => `Element is fully centered within the allowed tolerance (${tolerancePercent}%).`,
    };
  }

  return {
    pass: false,
    message: () => {
      const horizontalOffset = Math.abs(containerCenter.x - elementCenter.x);
      const verticalOffset = Math.abs(containerCenter.y - elementCenter.y);

      return `Element is not fully centered within the container (allowed tolerance: ±${tolerancePercent}%).

Offsets:
- Horizontal: ${horizontalOffset.toFixed(2)}px (tolerance: ±${horizontalTolerance.toFixed(2)}px)
- Vertical:   ${verticalOffset.toFixed(2)}px (tolerance: ±${verticalTolerance.toFixed(2)}px)

Adjust the element position to bring it closer to the container's center.`;
    },
  };
}
