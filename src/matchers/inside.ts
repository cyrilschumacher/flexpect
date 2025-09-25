import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';

function calculateDeltaX(elementBox: BoundingBox, containerBox: BoundingBox, tolerance: number): number {
  const overflowLeft = Math.max(0, containerBox.x - elementBox.x - tolerance);
  const overflowRight = Math.max(
    0,
    elementBox.x + elementBox.width - (containerBox.x + containerBox.width) - tolerance,
  );
  return overflowLeft + overflowRight;
}

function calculateDeltaY(elementBox: BoundingBox, containerBox: BoundingBox, tolerance: number): number {
  const overflowTop = Math.max(0, containerBox.y - elementBox.y - tolerance);
  const overflowBottom = Math.max(
    0,
    elementBox.y + elementBox.height - (containerBox.y + containerBox.height) - tolerance,
  );
  return overflowTop + overflowBottom;
}

export async function toBeInside(
  element: Locator,
  container: Locator,
  tolerancePercent = 0,
): Promise<MatcherReturnType> {
  const elementBox = await getBoundingBoxOrFail(element);
  const containerBox = await getBoundingBoxOrFail(container);

  const tolerance = (containerBox.width * tolerancePercent) / 100;
  const deltaX = calculateDeltaX(elementBox, containerBox, tolerance);
  const deltaY = calculateDeltaY(elementBox, containerBox, tolerance);
  if (deltaX === 0 && deltaY === 0) {
    return { pass: true, message: () => 'Element is properly inside the container.' };
  }

  const message = () =>
    `Expected element to be fully inside the container within ${tolerancePercent}% tolerance (±${tolerance.toFixed(2)}px), but received overflows: horizontal = ${deltaX.toFixed(2)}px, vertical = ${deltaY.toFixed(2)}px.`;
  return { pass: false, message };
}
