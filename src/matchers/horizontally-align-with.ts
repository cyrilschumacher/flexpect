import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

type Alignment = 'left' | 'center' | 'right';

function computeHorizontalDelta(alignment: Alignment, elementBox: BoundingBox, containerBox: BoundingBox): number {
  switch (alignment) {
    case 'left':
      return Math.abs(elementBox.x - containerBox.x);
    case 'right': {
      const actualRight = elementBox.x + elementBox.width;
      const containerRight = containerBox.x + containerBox.width;
      return Math.abs(actualRight - containerRight);
    }
    case 'center': {
      const containerCenter = containerBox.x + containerBox.width / 2;
      const elementCenter = elementBox.x + elementBox.width / 2;
      return Math.abs(elementCenter - containerCenter);
    }
    default:
      throw new Error(`Unknown horizontal alignment: ${alignment}`);
  }
}

export async function toBeHorizontallyAlignedWith(
  element: Locator,
  container: Locator,
  alignment: Alignment = 'center',
  tolerancePercent = 0,
): Promise<MatcherReturnType> {
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
