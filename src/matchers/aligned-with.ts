import { Locator } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

function getPosition(box: BoundingBox, axis: Axis, mode: Alignment): number {
  if (axis === Axis.Horizontal) {
    switch (mode) {
      case Alignment.Start:
        return box.x;
      case Alignment.Center:
        return box.x + box.width / 2;
      case Alignment.End:
        return box.x + box.width;
      default:
        throw new Error(`Invalid alignment mode: ${mode}`);
    }
  }

  if (axis === Axis.Vertical) {
    switch (mode) {
      case Alignment.Start:
        return box.y;
      case Alignment.Center:
        return box.y + box.height / 2;
      case Alignment.End:
        return box.y + box.height;
      default:
        throw new Error(`Invalid alignment mode: ${mode}`);
    }
  }

  throw new Error(`Invalid axis: '${axis}'.`);
}

/**
 * Defines possible alignment positions along an axis.
 *
 * @remarks
 * This enum is typically used in layout systems or UI components
 * to specify how content should be aligned within a container.
 */
export enum Alignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

/**
 * Defines the possible axes for alignment operations.
 *
 * @remarks
 * This enum is used to specify whether an alignment should be performed
 * horizontally or vertically.
 */
export enum Axis {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/**
 * Options for the `toBeAlignedWith` matcher.
 */
export interface ToBeAlignedWithOptions {
  /**
   * The axis along which the alignment should be checked.
   *
   * - `'horizontal'` for horizontal alignment.
   * - `'vertical'` for vertical alignment.
   *
   * @default Axis.Horizontal
   */
  axis?: Axis;

  /**
   * The alignment mode to use.
   *
   * Determines which edge or point of the element should be aligned.
   * Possible values are `'start'`, `'center'`, or `'end'`.
   *
   * @default Alignment.Center
   */
  mode?: Alignment;

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
 * according to the provided alignment options.
 *
 * @param container - The container element as a {@link Locator} relative to which alignment is checked.
 * @param options - Optional alignment options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Checks that the button is horizontally centered with its parent within 2% tolerance
 * await expect(buttonLocator).toBeAlignedWith(parentLocator, {
 *   axis: Axis.Horizontal,
 *   mode: Alignment.Center,
 *   tolerancePercent: 2
 * });
 *
 * @example
 * // Checks that the button is aligned with its parent using default alignment options
 * await expect(buttonLocator).toBeAlignedWith(parentLocator);
 */
export async function toBeAlignedWith(
  element: Locator,
  container: Locator,
  options: ToBeAlignedWithOptions = {},
): Promise<{ pass: boolean; message: () => string }> {
  const { axis = Axis.Horizontal, mode = Alignment.Start, tolerancePercent = 0 } = options;

  const elementBox = await getBoundingBoxOrFail(element);
  const elementPos = getPosition(elementBox, axis, mode);

  const containerBox = await getBoundingBoxOrFail(container);
  const containerPos = getPosition(containerBox, axis, mode);

  const size = axis === 'horizontal' ? containerBox.width : containerBox.height;
  const tolerance = (tolerancePercent / 100) * size;

  const delta = Math.abs(elementPos - containerPos);
  if (delta <= tolerance) {
    return {
      pass: true,
      message: () => `Element is aligned (${mode}) along ${axis} axis within ${tolerancePercent}% tolerance.`,
    };
  }

  return {
    pass: false,
    message: () =>
      `Element is misaligned with the container (${mode}, ${axis}).\n\n` +
      `Details:\n` +
      `- Allowed deviation: ±${tolerance.toFixed(2)}px (${tolerancePercent}%)\n` +
      `- Actual deviation:  ${delta.toFixed(2)}px\n\n` +
      `To fix this, ensure the element is aligned to the container's ${mode.toLowerCase()} edge along the ${axis.toLowerCase()} axis.`,
  };
}
