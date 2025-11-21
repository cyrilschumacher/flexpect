import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from './tolerance';

function getBorders(boundingBox: BoundingBox) {
  return {
    top: boundingBox.y,
    bottom: boundingBox.y + boundingBox.height,
    left: boundingBox.x,
    right: boundingBox.x + boundingBox.width,
  };
}

function computeDistance(side: DistanceSide, elementBox: BoundingBox, referenceBox: BoundingBox): number {
  const elementBorders = getBorders(elementBox);
  const referenceBorders = getBorders(referenceBox);

  switch (side) {
    case DistanceSide.Top:
      return Math.abs(elementBorders.top - referenceBorders.bottom);
    case DistanceSide.Right:
      return Math.abs(elementBorders.left - referenceBorders.right);
    case DistanceSide.Bottom:
      return Math.abs(elementBorders.bottom - referenceBorders.top);
    case DistanceSide.Left:
      return Math.abs(elementBorders.right - referenceBorders.left);
    default:
      throw new Error(`Unknown side: ${side}`);
  }
}

/**
 * Defines the sides of an element that can be used when measuring
 * distances relative to another element.
 *
 * @remarks
 * This enum is typically used in layout or testing utilities to specify
 * on which side of a reference element a distance should be evaluated.
 */
export enum DistanceSide {
  /**
   * The top edge of the element.
   */
  Top,

  /**
   * The right edge of the element.
   */
  Right,

  /**
   * The bottom edge of the element.
   */
  Bottom,

  /**
   * The left edge of the element.
   */
  Left,
}

/**
 * Options for the {@link toHaveDistanceFrom} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToHaveDistanceFromOptions extends Tolerance {}

/**
 * Asserts that the target element has a specific distance from another element on a given side.
 *
 * - **Top side** (side = `DistanceSide.Top`):
 * ```text
 * ┌───────────────────────┐
 * |   Reference Element   |
 * └───────────────────────┘
 *            ↑
 *            |  Expected distance = 100px
 * ┌───────────────────────┐
 * |     Target Element    |
 * └───────────────────────┘
 * ```
 * - **Bottom side** (side = `DistanceSide.Bottom`):
 * ```text
 * ┌───────────────────────┐
 * |     Target Element    |
 * └───────────────────────┘
 *            |  Expected distance = 100px
 *            ↓
 * ┌───────────────────────┐
 * |   Reference Element   |
 * └───────────────────────┘
 * ```
 * - **Left side** (side = `DistanceSide.Left`):
 * ```text
 * ┌───────────────────────┐             ┌───────────────────────┐
 * |   Reference Element   | <--100px--> |     Target Element    |
 * └───────────────────────┘             └───────────────────────┘
 * ```
 * - **Right side** (side = `DistanceSide.Right`):
 * ```text
 * ┌───────────────────────┐             ┌───────────────────────┐
 * |     Target Element    | <--100px--> |   Reference Element   |
 * └───────────────────────┘             └───────────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for distance.
 * @param reference - The reference element to compare against.
 * @param referenceSide - Which side of the reference to measure the distance from.
 * @param expectedDistanceInPixels - Expected distance in pixels between the elements.
 * @param options - Optional distance options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Check that element is 100px below reference, allowing 10px of tolerance
 * await expect(element).toHaveDistanceFrom(reference, DistanceSide.Top, 100, {
 *   tolerance: 10,
 *   toleranceUnit: ToleranceUnit.Pixels
 * });
 *
 * @example
 * // Check that element is 200px to the right of reference, with a tolerance of 15px
 * await expect(element).toHaveDistanceFrom(reference, DistanceSide.Right, 200, {
 *   tolerance: 15,
 *   toleranceUnit: ToleranceUnit.Pixels
 * });
 */
export async function toHaveDistanceFrom(
  element: Locator,
  reference: Locator,
  referenceSide: DistanceSide,
  expectedDistanceInPixels: number,
  options: ToHaveDistanceFromOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const referenceBoundingBox = await getBoundingBoxOrFail(reference);

  const delta = computeDistance(referenceSide, elementBoundingBox, referenceBoundingBox);
  const toleranceInPixels =
    toleranceUnit === ToleranceUnit.Percent ? (expectedDistanceInPixels * tolerance) / 100 : tolerance;
  if (delta <= expectedDistanceInPixels + toleranceInPixels && delta >= expectedDistanceInPixels - toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        const formattedSide = DistanceSide[referenceSide].toLowerCase();
        if (tolerance === 0) {
          return `Element is exactly ${formattedSide}-aligned at ${expectedDistanceInPixels}px.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is ${formattedSide}-aligned within the tolerance of ±${tolerance}${toleranceUnitSymbol} from the expected ${expectedDistanceInPixels}px.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
      const formattedSide = DistanceSide[referenceSide].toLowerCase();

      const actualDistance = delta.toFixed(2);
      const allowedDeviation = toleranceInPixels.toFixed(2);
      const difference = (delta - expectedDistanceInPixels).toFixed(2);

      const oppositeSide = {
        [DistanceSide.Top]: 'bottom',
        [DistanceSide.Right]: 'left',
        [DistanceSide.Bottom]: 'top',
        [DistanceSide.Left]: 'right',
      }[referenceSide];

      return `Element is not ${formattedSide}-aligned within the allowed tolerance of ±${tolerance}${toleranceUnitSymbol} from the expected ${expectedDistanceInPixels}px.

Details:
- Expected distance: ${expectedDistanceInPixels}px
- Actual distance:   ${actualDistance}px
- Allowed deviation: ±${allowedDeviation}px (±${tolerance}${toleranceUnitSymbol})
- Difference:        ${difference}px

To fix this, adjust the ${formattedSide} position of the element (or the ${oppositeSide} of the reference) using margin, padding, or layout properties so the gap is closer to ${expectedDistanceInPixels}px.`;
    },
  };
}
