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
        throw new Error(`Invalid alignment mode '${mode}' for axis '${axis}'.`);
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
 * Represents the possible axes for alignment operations.
 *
 * @remarks
 * This enum is used to specify whether an alignment should be performed
 * horizontally or vertically.
 *
 * @enum {string}
 * @property {string} Horizontal - Represents the horizontal axis.
 * @property {string} Vertical - Represents the vertical axis.
 */
export interface ToBeAlignedWithOptions {
  axis?: Axis;
  mode?: Alignment;
  tolerancePercent?: number;
}

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
      `Expected element to be aligned (${mode}) along ${axis} axis within ${tolerancePercent}% tolerance (${tolerance.toFixed(2)}px), but difference was ${delta.toFixed(2)}px.`,
  };
}
