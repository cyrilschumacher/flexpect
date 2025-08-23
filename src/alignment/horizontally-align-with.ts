import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from '../helpers/get-bounding-box-or-fail';

type Alignment = 'left' | 'center' | 'right';

function computeHorizontalDelta(
  alignment: Alignment,
  receivedBoundingBox: BoundingBox,
  containerBoundingBox: BoundingBox,
): number {
  switch (alignment) {
    case 'left':
      return Math.abs(receivedBoundingBox.x - containerBoundingBox.x);
    case 'right': {
      const actualRight = receivedBoundingBox.x + receivedBoundingBox.width;
      const containerRight = containerBoundingBox.x + containerBoundingBox.width;
      return Math.abs(actualRight - containerRight);
    }
    default: {
      const containerCenter = containerBoundingBox.x + containerBoundingBox.width / 2;
      const elementCenter = receivedBoundingBox.x + receivedBoundingBox.width / 2;
      return Math.abs(elementCenter - containerCenter);
    }
  }
}

function formatAlignmentMessage(
  pass: boolean,
  alignment: Alignment,
  tolerancePercent: number,
  delta: number,
  tolerance: number,
): string {
  if (pass) {
    return `Expected element NOT to be ${alignment}-aligned within ${tolerancePercent}% tolerance, but it was.`;
  }

  return `Expected element to be ${alignment}-aligned within ${tolerancePercent}% tolerance (${tolerance.toFixed(2)}px). Received delta: ${delta.toFixed(2)}px.`;
}

export async function toBeHorizontallyAlignedWith(
  received: Locator,
  container: Locator,
  alignment: Alignment = 'center',
  tolerancePercent = 5,
): Promise<MatcherReturnType> {
  const receivedBoundingBox = await getBoundingBoxOrFail(received);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const delta = computeHorizontalDelta(alignment, receivedBoundingBox, containerBoundingBox);
  const tolerance = (containerBoundingBox.width * tolerancePercent) / 100;

  const pass = delta <= tolerance;
  return {
    pass,
    message: () => formatAlignmentMessage(pass, alignment, tolerancePercent, delta, tolerance),
  };
}
