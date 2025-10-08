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
 * Options for the `toBeVerticallyAlignedWith` matcher.
 */
export interface ToBeVerticallyAlignedWithOptions {
  /**
   * The vertical alignment mode to use.
   *
   * Determines which vertical edge or point of the element should be aligned.
   * Possible values are `'top'`, `'center'`, or `'bottom'`.
   *
   * @default VerticalAlignment.Center
   */
  alignment?: VerticalAlignment;

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

export async function toBeVerticallyAlignedWith(
  element: Locator,
  container: Locator,
  options: ToBeVerticallyAlignedWithOptions = {},
): Promise<MatcherReturnType> {
  const { alignment = VerticalAlignment.Center, tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const delta = computeVerticalDelta(alignment, elementBox, containerBox);
  const tolerance = (containerBox.height * tolerancePercent) / 100;
  if (delta <= tolerance) {
    return { pass: true, message: () => 'Element is properly aligned.' };
  }

  return {
    pass: false,
    message: () =>
      `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (±${tolerance.toFixed(2)}px), but received a delta of ${delta.toFixed(2)}px.`,
  };
}
