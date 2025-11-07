import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

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
  Start = 'start',

  /**
   * Aligns the center of the target with the center of the container.
   */
  Center = 'center',

  /**
   * Aligns the end edge of the target with the end edge of the container.
   *
   * - Horizontal: right edge
   * - Vertical: bottom edge
   */
  End = 'end',
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
  Horizontal = 'horizontal',

  /**
   * Alignment along the vertical axis (top/bottom).
   */
  Vertical = 'vertical',
}

/**
 * Options for the {@link toBeAlignedWith} matcher.
 */
export interface ToBeAlignedWithOptions {
  /**
   * Allowed tolerance for the alignment expressed as a percentage (%).
   *
   * The matcher will pass if the alignment difference is within this percentage of the reference size.
   *
   * @default 0
   */
  tolerancePercent?: number;
}

/**
 * Asserts that the target element is aligned with the specified container element
 * based on the provided axis and alignment mode, considering an optional tolerance percentage.
 *
 * This assertion compares the position of the element relative to the container along the given axis (horizontal or
 * vertical) and verifies if it matches the expected alignment mode (start, center, or end).
 *
 * If the alignment falls outside the allowed tolerance, a detailed message is returned to help diagnose the
 * misalignment.
 *
 * - **Horizontal axis (`axis = 'horizontal'`)**:
 *   - *Start (`mode = start'`)*:
 *     ```text
 *     |[element]------------------|
 *     |                           |
 *     |                           |
 *     ```
 *   - *Center (`mode = 'center'`)*:
 *     ```text
 *     |---------[element]---------|
 *     |                           |
 *     |                           |
 *     ```
 *   - *End (`mode = 'end'`)*:
 *     ```text
 *     |------------------[element]|
 *     |                           |
 *     |                           |
 *     ```
 *
 * - **Vertical axis (`axis = 'vertical'`)**:
 *   - *Start (`mode = 'start'`)*:
 *     ```text
 *     |[element]                  |
 *     |                           |
 *     |                           |
 *     ```
 *   - *Center (`mode = 'center'`)*:
 *     ```text
 *     |                           |
 *     |         [element]         |
 *     |                           |
 *     ```
 *   - *End (`mode = 'end'`)*:
 *     ```text
 *     |                           |
 *     |                           |
 *     |                  [element]|
 *     ```
 *
 * @param container - The container element as a {@link Locator} relative to which alignment is checked.
 * @param axis - The axis along which to check alignment (horizontal or vertical).
 * @param mode - The alignment mode to check (start, center, or end).
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the button is horizontally centered with its parent within 2% tolerance
 * await expect(buttonLocator).toBeAlignedWith(parentLocator, Axis.Horizontal, Alignment.Center, {
 *   tolerancePercent: 2,
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
  const { tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const elementPosition = getPosition(elementBox, axis, mode);
  const containerPosition = getPosition(containerBox, axis, mode);
  const size = axis === Axis.Horizontal ? containerBox.width : containerBox.height;

  const delta = Math.abs(elementPosition - containerPosition);
  const tolerance = (tolerancePercent / 100) * size;
  if (delta <= tolerance) {
    return {
      pass: true,
      message: () => `Element is aligned (${mode}) along ${axis} axis within ${tolerancePercent}% tolerance.`,
    };
  }

  return {
    pass: false,
    message: () => {
      const allowedDerivation = tolerance.toFixed(2);
      const actualDerivation = delta.toFixed(2);
      const lowerCaseMode = mode.toLowerCase();
      const lowerCaseAxis = axis.toLowerCase();

      return `Element is misaligned with the container (${mode}, ${axis}).

Details:
- Allowed deviation: ±${allowedDerivation}px (${tolerancePercent}%)
- Actual deviation:  ${actualDerivation}px

To fix this, ensure the element is aligned to the container's ${lowerCaseMode} edge along the ${lowerCaseAxis} axis.`;
    },
  };
}
