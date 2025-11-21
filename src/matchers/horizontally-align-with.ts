import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

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
  Center,

  /**
   * The left edges of the target and container are equal within the tolerance.
   */
  Left,

  /**
   * The right edges of the target and container are equal within the tolerance.
   */
  Right,
}

/**
 * Options for the {@link toBeHorizontallyAlignedWith} matcher.
 */
export type ToBeHorizontallyAlignedWithOptions = Tolerance;

/**
 * Asserts that the target element is horizontally aligned with the specified container
 * according to the given alignment type.
 *
 * - **Left alignment** (alignment = `HorizontalAlignment.Left`):
 * ```text
 * ┌───────────────────────────────┐
 * │┌─────────┐                    │
 * ││ Element │                    │
 * │└─────────┘                    │
 * └───────────────────────────────┘
 * ```
 *
 * - **Center alignment** (alignment = `HorizontalAlignment.Center`):
 * ```text
 * ┌───────────────────────────────┐
 * │          ┌─────────┐          │
 * │          │ Element │          │
 * │          └─────────┘          │
 * └───────────────────────────────┘
 * ```
 *
 * - **Right alignment** (alignment = `HorizontalAlignment.Right`):
 * ```text
 * ┌───────────────────────────────┐
 * │                    ┌─────────┐│
 * │                    │ Element ││
 * │                    └─────────┘│
 * └───────────────────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for horizontal alignment.
 * @param container - The container element as a {@link Locator} relative to which horizontal alignment is checked.
 * @param alignment - The type of horizontal alignment to check (left, center, or right).
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Assert that a button is left-aligned with its card container, allowing 3% horizontal tolerance
 * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator, HorizontalAlignment.Left, {
 *   tolerance: 3, toleranceUnit: ToleranceUnit.Percent
 * });
 *
 * @example
 * // Assert that a button is horizontally centered with its card container (default options)
 * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator, HorizontalAlignment.Center);
 */
export async function toBeHorizontallyAlignedWith(
  element: Locator,
  container: Locator,
  alignment: HorizontalAlignment,
  options: ToBeHorizontallyAlignedWithOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  if (tolerance < 0) {
    throw new Error('"tolerance" must be greater than or equal to 0');
  }

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const delta = computeHorizontalDelta(alignment, elementBoundingBox, containerBoundingBox);
  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.width * tolerance) / 100 : tolerance;
  if (delta <= toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        const formattedAlignment = HorizontalAlignment[alignment].toLowerCase();
        if (tolerance === 0) {
          return `Element is perfectly ${formattedAlignment}-aligned.`;
        }

        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        return `Element is properly ${formattedAlignment}-aligned within the allowed tolerance (${tolerance}${unit}).`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';

      const formattedAlignment = HorizontalAlignment[alignment].toLowerCase();
      const allowedDelta = toleranceInPixels.toFixed(2);
      const actualDelta = delta.toFixed(2);

      return `Element is not ${formattedAlignment}-aligned within the allowed tolerance of ${tolerance}${unit}.

Details:
- Allowed delta: ±${allowedDelta}px
- Actual delta:  ${actualDelta}px

Adjust the element's horizontal position to reduce the alignment difference.`;
    },
  };
}
