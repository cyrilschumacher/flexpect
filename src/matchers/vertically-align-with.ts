import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

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
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToBeVerticallyAlignedWithOptions extends Tolerance {}

/**
 * Asserts that the target element is vertically aligned with the specified container
 * according to the given alignment type.
 *
 * - **Top alignment** (alignment = `VerticalAlignment.Top`):
 * ```text
 * ┌───────────────────────────────┐
 * │┌─────────┐                    │
 * ││ Element │                    │
 * │└─────────┘                    │
 * │                               │
 * │                               │
 * │                               │
 * └───────────────────────────────┘
 * ```
 * - **Center alignment** (alignment = `VerticalAlignment.Center`):
 * ```text
 * ┌───────────────────────────────┐
 * │                               │
 * │                               │
 * │┌─────────┐                    │
 * ││ Element │                    │
 * │└─────────┘                    │
 * │                               │
 * │                               │
 * └───────────────────────────────┘
 * ```
 *
 * - **Bottom alignment** (alignment = `VerticalAlignment.Bottom`):
 * ```text
 * ┌───────────────────────────────┐
 * │                               │
 * │                               │
 * │                               │
 * │┌─────────┐                    │
 * ││ Element │                    │
 * │└─────────┘                    │
 * └───────────────────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for vertical alignment.
 * @param container - The container element as a {@link Locator} relative to which vertical alignment is checked.
 * @param alignment - The type of vertical alignment to check (top, center, or bottom).
 * @param options - Optional size comparison options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Check that a header is bottom-aligned with its section container, allowing a 2% vertical tolerance
 * await expect(headerLocator).toBeVerticallyAlignedWith(parentLocator, VerticalAlignment.Bottom, {
 *   tolerance: 2,
 *   toleranceUnit: ToleranceUnit.Percent,
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
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  if (tolerance < 0) {
    throw new Error('"tolerance" must be greater than or equal to 0');
  }

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const delta = computeVerticalDelta(alignment, elementBoundingBox, containerBoundingBox);
  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (containerBoundingBox.height * tolerance) / 100 : tolerance;
  if (delta <= toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        if (tolerance === 0) {
          return `Element is properly ${alignment} aligned.`;
        }

        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        return `Element is properly ${alignment} aligned with a tolerance of ${tolerance}${unit}.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';

      const allowedDelta = toleranceInPixels.toFixed(2);
      const actualDelta = delta.toFixed(2);

      return `Element is not ${alignment}-aligned within the allowed tolerance of ${tolerance}${unit}.

Details:
- Allowed delta: ±${allowedDelta}px
- Actual delta:  ${actualDelta}px

Please adjust the element's vertical position to reduce the alignment difference.`;
    },
  };
}
