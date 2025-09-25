import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

type VerticalAlignment = 'top' | 'center' | 'bottom';

function computeVerticalDelta(
  alignment: VerticalAlignment,
  elementBox: BoundingBox,
  containerBox: BoundingBox,
): number {
  switch (alignment) {
    case 'top':
      return Math.abs(elementBox.y - containerBox.y);
    case 'bottom': {
      const actualBottom = elementBox.y + elementBox.height;
      const containerBottom = containerBox.y + containerBox.height;
      return Math.abs(actualBottom - containerBottom);
    }
    case 'center': {
      const containerCenter = containerBox.y + containerBox.height / 2;
      const elementCenter = elementBox.y + elementBox.height / 2;
      return Math.abs(elementCenter - containerCenter);
    }
    default:
      throw new Error(`Unknown vertical alignment: ${alignment}`);
  }
}

export async function toBeVerticallyAlignedWith(
  element: Locator,
  container: Locator,
  alignment: VerticalAlignment = 'center',
  tolerancePercent = 0,
): Promise<MatcherReturnType> {
  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const delta = computeVerticalDelta(alignment, elementBox, containerBox);
  const tolerance = (containerBox.height * tolerancePercent) / 100;
  if (delta <= tolerance) {
    return { pass: true, message: () => 'Element is properly aligned.' };
  }

  const message = () =>
    `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (±${tolerance.toFixed(2)}px), but received a delta of ${delta.toFixed(2)}px.`;
  return { pass: false, message };
}
