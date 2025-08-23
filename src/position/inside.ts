import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from '../helpers/get-bounding-box-or-fail';

function formatInsideMessage(
  pass: boolean,
  tolerance: number,
  tolerancePercent: number,
  deltaX: number,
  deltaY: number,
): string {
  if (pass) {
    return `Expected element NOT to be fully inside the container within ${tolerancePercent}% tolerance, but it was.`;
  }

  return `Expected element to be fully inside the container within ${tolerancePercent}% tolerance (~${tolerance.toFixed(2)}px). Horizontal overflow: ${deltaX.toFixed(2)}px, Vertical overflow: ${deltaY.toFixed(2)}px.`;
}

function calculateDeltaX(
  receivedBoundingBox: BoundingBox,
  containerBoundingBox: BoundingBox,
  tolerance: number,
): number {
  const overflowLeft = Math.max(0, containerBoundingBox.x - receivedBoundingBox.x - tolerance);
  const overflowRight = Math.max(
    0,
    receivedBoundingBox.x +
      receivedBoundingBox.width -
      (containerBoundingBox.x + containerBoundingBox.width) -
      tolerance,
  );
  return overflowLeft + overflowRight;
}

function calculateDeltaY(
  receivedBoundingBox: BoundingBox,
  containerBoundingBox: BoundingBox,
  tolerance: number,
): number {
  const overflowTop = Math.max(0, containerBoundingBox.y - receivedBoundingBox.y - tolerance);
  const overflowBottom = Math.max(
    0,
    receivedBoundingBox.y +
      receivedBoundingBox.height -
      (containerBoundingBox.y + containerBoundingBox.height) -
      tolerance,
  );
  return overflowTop + overflowBottom;
}

export async function toBeInside(
  received: Locator,
  container: Locator,
  tolerancePercent = 0,
): Promise<MatcherReturnType> {
  const receivedBoundingBox = await getBoundingBoxOrFail(received);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const tolerance = (containerBoundingBox.width * tolerancePercent) / 100;

  const deltaX = calculateDeltaX(receivedBoundingBox, containerBoundingBox, tolerance);
  const deltaY = calculateDeltaY(receivedBoundingBox, containerBoundingBox, tolerance);

  const pass = deltaX === 0 && deltaY === 0;

  return {
    pass,
    message: () => formatInsideMessage(pass, tolerance, tolerancePercent, deltaX, deltaY),
  };
}
