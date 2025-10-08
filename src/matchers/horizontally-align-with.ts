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
    return { pass: true, message: () => 'Element is properly aligned.' };
  }

  return {
    pass: false,
    message: () =>
      `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (±${tolerance.toFixed(2)}px), but received a delta of ${delta.toFixed(2)}px.`,
  };
}
