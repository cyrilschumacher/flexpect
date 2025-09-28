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

export enum HorizontalAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export interface ToBeHorizontallyAlignedWithOptions {
  alignment?: HorizontalAlignment;
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

  const message = () =>
    `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (±${tolerance.toFixed(2)}px), but received a delta of ${delta.toFixed(2)}px.`;
  return { pass: false, message };
}
