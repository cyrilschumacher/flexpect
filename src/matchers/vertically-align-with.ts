import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

function computeVerticalDelta(
  alignment: VerticalAlignment,
  elementBox: BoundingBox,
  containerBox: BoundingBox,
): number {
  switch (alignment) {
    case VerticalAlignment.Top:
      return Math.abs(elementBox.y - containerBox.y);
    case VerticalAlignment.Bottom: {
      const actualBottom = elementBox.y + elementBox.height;
      const containerBottom = containerBox.y + containerBox.height;
      return Math.abs(actualBottom - containerBottom);
    }
    case VerticalAlignment.Center: {
      const containerCenter = containerBox.y + containerBox.height / 2;
      const elementCenter = elementBox.y + elementBox.height / 2;
      return Math.abs(elementCenter - containerCenter);
    }
    default:
      throw new Error(`Unknown vertical alignment: ${alignment}`);
  }
}

/**
 * Defines possible vertical alignment positions.
 *
 * @remarks
 * This enum is used to specify how an element should be aligned vertically
 * relative to another element or container.
 */
export enum VerticalAlignment {
  /**
   * The bottom edges of the target and container are equal within the tolerance.
   */
  Bottom = 'bottom',

  /**
   * The vertical centers of the target and container are equal within the tolerance.
   */
  Center = 'center',

  /**
   * The top edges of the target and container are equal within the tolerance.
   */
  Top = 'top',
}

/**
 * Options for the {@link toBeVerticallyAlignedWith} matcher.
 */
export interface ToBeVerticallyAlignedWithOptions {
  /**
   * Allowed tolerance for the vertical alignment difference, expressed as a percentage (%)
   * of the container element's height.
   *
   * The matcher passes if the vertical difference between the aligned edges or points
   * of the target and container is within this percentage.
   *
   * For example, a `tolerancePercent` of 5 allows the elements to be misaligned by up to
   * 5% of the container's height without failing the assertion.
   *
   * If omitted, the default tolerance is `0`, requiring exact alignment.
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element is vertically aligned with the specified container
 * according to the given alignment type.
 *
 * - **Top alignment (`alignment = 'top'`)**:
 *   ```text
 *   |[element]|
 *   |         |
 *   |         |
 *   ```
 *
 * - **Center alignment (`alignment = 'center'`)**:
 *   ```text
 *   |         |
 *   |[element]|
 *   |         |
 *   ```
 *
 * - **Bottom alignment (`alignment = 'bottom'`)**:
 *   ```text
 *   |         |
 *   |         |
 *   |[element]|
 *   ```
 *
 * @param container - The container element as a {@link Locator} relative to which vertical alignment is checked.
 * @param alignment - The type of vertical alignment to check (top, center, or bottom).
 * @param options - Optional size comparison options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Check that a header is bottom-aligned with its section container, allowing a 2% vertical tolerance
 * await expect(headerLocator).toBeVerticallyAlignedWith(parentLocator, VerticalAlignment.Bottom, {
 *   tolerancePercent: 2
 * });
 *
 * @example
 * // Check that a header is vertically centered within its section container (default options)
 * await expect(headerLocator).toBeVerticallyAlignedWith(parentLocator, VerticalAlignment.Center);
 */
export async function toBeVerticallyAlignedWith(
  element: Locator,
  container: Locator,
  alignment: VerticalAlignment,
  options: ToBeVerticallyAlignedWithOptions = {},
): Promise<MatcherReturnType> {
  const { tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const delta = computeVerticalDelta(alignment, elementBox, containerBox);
  const tolerance = (containerBox.height * tolerancePercent) / 100;
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
      `Please adjust the element's vertical position to reduce the alignment difference.`,
  };
}
