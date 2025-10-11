import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

function computeHorizontalDelta(
  alignment: HorizontalAlignment,
  elementBox: BoundingBox,
  containerBox: BoundingBox,
): number {
  switch (alignment) {
    case HorizontalAlignment.Left:
      return Math.abs(elementBox.x - containerBox.x);
    case HorizontalAlignment.Right: {
      const actualRight = elementBox.x + elementBox.width;
      const containerRight = containerBox.x + containerBox.width;
      return Math.abs(actualRight - containerRight);
    }
    case HorizontalAlignment.Center: {
      const containerCenter = containerBox.x + containerBox.width / 2;
      const elementCenter = elementBox.x + elementBox.width / 2;
      return Math.abs(elementCenter - containerCenter);
    }
    default:
      throw new Error(`Unknown horizontal alignment: ${alignment}`);
  }
}

/**
 * Defines possible horizontal alignment positions.
 *
 * @remarks
 * This enum is used to specify how an element should be aligned horizontally
 * relative to another element or container.
 */
export enum HorizontalAlignment {
  /**
   * The horizontal centers of the target and container are equal within the tolerance.
   */
  Center = 'center',

  /**
   * The left edges of the target and container are equal within the tolerance.
   */
  Left = 'left',

  /**
   * The right edges of the target and container are equal within the tolerance.
   */
  Right = 'right',
}

/**
 * Options for the `toBeHorizontallyAlignedWith` matcher.
 */
export interface ToBeHorizontallyAlignedWithOptions {
  /**
   * The horizontal alignment mode to use.
   *
   * Determines which horizontal edge or point of the element should be aligned.
   * Possible values are `'left'`, `'center'`, or `'right'`.
   *
   * @default HorizontalAlignment.Center
   */
  alignment?: HorizontalAlignment;

  /**
   * Allowed tolerance for the horizontal alignment difference, expressed as a percentage (%)
   * of the container element's width.
   *
   * The matcher passes if the horizontal difference between the aligned edges or points
   * of the target and container is within this percentage.
   *
   * For example, a `tolerancePercent` of 5 allows the elements to be misaligned by up to
   * 5% of the container's width without failing the assertion.
   *
   * If omitted, the default tolerance is `0`, requiring exact alignment.
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element is horizontally aligned with the specified container
 * according to the given alignment type.
 *
 * @param container - The container element as a {@link Locator} relative to which horizontal alignment is checked.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Assert that a button is left-aligned with its card container, allowing 3% horizontal tolerance
 * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator, {
 *   alignment: HorizontalAlignment.Left,
 *   tolerancePercent: 3
 * });
 *
 * @example
 * // Assert that a button is horizontally centered with its card container (default options)
 * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator);
 */
export async function toBeHorizontallyAlignedWith(
  element: Locator,
  container: Locator,
  options: ToBeHorizontallyAlignedWithOptions = {},
): Promise<MatcherReturnType> {
  const { alignment = HorizontalAlignment.Center, tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const delta = computeHorizontalDelta(alignment, elementBox, containerBox);
  const tolerance = (containerBox.width * tolerancePercent) / 100;
  if (delta <= tolerance) {
    return {
      pass: true,
      message: () => `Element is properly ${alignment}-aligned within the allowed tolerance (${tolerancePercent}%).`,
    };
  }

  return {
    pass: false,
    message: () =>
      `Element is not ${alignment}-aligned within the allowed tolerance of ${tolerancePercent}%.\n\n` +
      `Details:\n` +
      `- Allowed delta: ±${tolerance.toFixed(2)}px\n` +
      `- Actual delta:  ${delta.toFixed(2)}px\n\n` +
      `Adjust the element's horizontal position to reduce the alignment difference.`,
  };
}
