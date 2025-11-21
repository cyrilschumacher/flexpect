import { Locator, MatcherReturnType } from '@playwright/test';

import { BoundingBox, getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { getToleranceUnitSymbol, Tolerance, ToleranceUnit, validateTolerance } from '@helpers/tolerance';

function getPosition(box: BoundingBox, axis: Axis, mode: Alignment): number {
  const origin = axis === Axis.Horizontal ? box.x : box.y;
  const length = axis === Axis.Horizontal ? box.width : box.height;

  switch (mode) {
    case Alignment.Start:
      return origin;
    case Alignment.Center:
      return origin + length / 2;
    case Alignment.End:
      return origin + length;
    default:
      throw new Error(`Invalid alignment mode: ${mode}`);
  }
}

/**
 * Defines possible alignment positions along an axis.
 *
 * @remarks
 * This enum is typically used in layout systems or UI components
 * to specify how content should be aligned within a container.
 */
export enum Alignment {
  /**
   * Aligns the start edge of the target with the start edge of the container.
   *
   * - Horizontal: left edge
   * - Vertical: top edge
   */
  Start,

  /**
   * Aligns the center of the target with the center of the container.
   */
  Center,

  /**
   * Aligns the end edge of the target with the end edge of the container.
   *
   * - Horizontal: right edge
   * - Vertical: bottom edge
   */
  End,
}

/**
 * Defines the possible axes for alignment operations.
 *
 * @remarks
 * This enum is used to specify whether an alignment should be performed
 * horizontally (along the X-axis) or vertically (along the Y-axis).
 */
export enum Axis {
  /**
   * Alignment along the horizontal axis (left/right).
   */
  Horizontal,

  /**
   * Alignment along the vertical axis (top/bottom).
   */
  Vertical,
}

/**
 * Options for the {@link toBeAlignedWith} matcher.
 */
export type ToBeAlignedWithOptions = Tolerance;

/**
 * Asserts that the target element is aligned with the specified container element
 * based on the provided axis and alignment mode, considering an optional tolerance percentage.
 *
 * - **Horizontal Start Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │┌─────────┐                    │
 * ││ Element │                    │
 * │└─────────┘                    │
 * └───────────────────────────────┘
 * ```
 * - **Horizontal Center Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │          ┌─────────┐          │
 * │          │ Element │          │
 * │          └─────────┘          │
 * └───────────────────────────────┘
 * ```
 * - **Horizontal End Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │                    ┌─────────┐│
 * │                    │ Element ││
 * │                    └─────────┘│
 * └───────────────────────────────┘
 * ```
 * - **Vertical Start Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │┌─────────────────────────────┐│
 * ││           Element           ││
 * │└─────────────────────────────┘│
 * │                               │
 * │                               │
 * └───────────────────────────────┘
 * ```
 * - **Vertical Center Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │┌─────────────────────────────┐│
 * ││           Element           ││
 * │└─────────────────────────────┘│
 * │                               │
 * └───────────────────────────────┘
 * ```
 * - **Vertical End Alignment**:
 * ```text
 * ┌───────────────────────────────┐
 * │                               │
 * │                               │
 * │┌─────────────────────────────┐│
 * ││           Element           ││
 * │└─────────────────────────────┘│
 * └───────────────────────────────┘
 * ```
 *
 * @param element - The element as a {@link Locator} to check for alignment.
 * @param container - The container element as a {@link Locator} relative to which alignment is checked.
 * @param axis - The axis along which to check alignment (horizontal or vertical).
 * @param mode - The alignment mode to check (start, center, or end).
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the button is horizontally centered with its parent within 2% tolerance
 * await expect(buttonLocator).toBeAlignedWith(parentLocator, Axis.Horizontal, Alignment.Center, {
 *   tolerance: 2,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 *
 * @example
 * // Checks that the button is aligned to the start vertically with no tolerance
 * await expect(buttonLocator).toBeAlignedWith(parentLocator, Axis.Vertical, Alignment.Start);
 */
export async function toBeAlignedWith(
  element: Locator,
  container: Locator,
  axis: Axis,
  mode: Alignment,
  options: ToBeAlignedWithOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  validateTolerance(tolerance);

  const elementBoundingBox = await getBoundingBoxOrFail(element);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const elementPosition = getPosition(elementBoundingBox, axis, mode);
  const containerPosition = getPosition(containerBoundingBox, axis, mode);
  const size = axis === Axis.Horizontal ? containerBoundingBox.width : containerBoundingBox.height;

  const toleranceInPixels = toleranceUnit === ToleranceUnit.Percent ? (tolerance / 100) * size : tolerance;
  const delta = Math.abs(elementPosition - containerPosition);
  if (delta <= toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        const formattedMode = Alignment[mode].toLowerCase();
        const formattedAxis = Axis[axis].toLowerCase();
        if (tolerance === 0) {
          return `Element is aligned (${formattedMode}) along ${formattedAxis} axis.`;
        }

        const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);
        return `Element is aligned (${formattedMode}) along ${formattedAxis} axis within ${tolerance}${toleranceUnitSymbol} tolerance.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const formattedMode = Alignment[mode].toLowerCase();
      const formattedAxis = Axis[axis].toLowerCase();
      const toleranceUnitSymbol = getToleranceUnitSymbol(toleranceUnit);

      const allowedDeviation = toleranceInPixels.toFixed(2);
      const actualDeviation = delta.toFixed(2);

      return `Element is misaligned with the container (${formattedMode}, ${formattedAxis}).

Details:
- Allowed deviation: ±${allowedDeviation}px (${tolerance}${toleranceUnitSymbol})
- Actual deviation:  ${actualDeviation}px

To fix this, ensure the element is aligned to the container's ${formattedMode} edge along the ${formattedAxis} axis.`;
    },
  };
}
