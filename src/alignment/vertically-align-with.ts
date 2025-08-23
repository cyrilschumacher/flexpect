import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './get-bounding-box-or-fail';

type VerticalAlignment = 'top' | 'center' | 'bottom';

function computeVerticalDelta(
  alignment: VerticalAlignment,
  receivedBoundingBox: BoundingBox,
  containerBoundingBox: BoundingBox,
): number {
  switch (alignment) {
    case 'top':
      return Math.abs(receivedBoundingBox.y - containerBoundingBox.y);
    case 'bottom': {
      const actualBottom = receivedBoundingBox.y + receivedBoundingBox.height;
      const containerBottom = containerBoundingBox.y + containerBoundingBox.height;
      return Math.abs(actualBottom - containerBottom);
    }
    default: {
      // center
      const containerCenter = containerBoundingBox.y + containerBoundingBox.height / 2;
      const elementCenter = receivedBoundingBox.y + receivedBoundingBox.height / 2;
      return Math.abs(elementCenter - containerCenter);
    }
  }
}

function formatVerticalAlignmentMessage(
  pass: boolean,
  alignment: VerticalAlignment,
  tolerancePercent: number,
  delta: number,
  tolerance: number,
): string {
  if (pass) {
    return `Expected element NOT to be ${alignment}-aligned within ${tolerancePercent}% tolerance, but it was.`;
  }
  return `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (${tolerance.toFixed(2)}px). Received delta: ${delta.toFixed(2)}px.`;
}

export async function toBeVerticallyAlignedWith(
  received: Locator,
  container: Locator,
  alignment: VerticalAlignment = 'center',
  tolerancePercent = 5,
): Promise<MatcherReturnType> {
  const receivedBoundingBox = await getBoundingBoxOrFail(received);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const delta = computeVerticalDelta(alignment, receivedBoundingBox, containerBoundingBox);
  const tolerance = (containerBoundingBox.height * tolerancePercent) / 100;

  const pass = delta <= tolerance;
  return {
    pass,
    message: () => formatVerticalAlignmentMessage(pass, alignment, tolerancePercent, delta, tolerance),
  };
}
