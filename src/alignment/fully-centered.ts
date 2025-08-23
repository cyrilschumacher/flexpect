import { Locator } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './get-bounding-box-or-fail';

function getCenter(boundingBox: BoundingBox) {
  return {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
}

function isWithinTolerance(
  valueA: number,
  valueB: number,
  tolerance: number,
): boolean {
  return Math.abs(valueA - valueB) <= tolerance;
}

function getCenterMessage(
  container: BoundingBox,
  element: BoundingBox,
  tolerancePercent: number,
): string {
  const containerCenter = getCenter(container);
  const elementCenter = getCenter(element);

  const horizontalOffset = Math.abs(containerCenter.x - elementCenter.x);
  const verticalOffset = Math.abs(containerCenter.y - elementCenter.y);

  return `Expected element to be centered within container (±${tolerancePercent}%), but:
- Horizontal offset: ${horizontalOffset.toFixed(2)}px
- Vertical offset: ${verticalOffset.toFixed(2)}px`;
}

export async function toBeFullyCentered(
  received: Locator,
  container: Locator,
  tolerancePercent: number = 5,
) {
  const receivedBoundingBox = await getBoundingBoxOrFail(received);
  const containerBoundingBox = await getBoundingBoxOrFail(container);

  const horizontalTolerance =
    (containerBoundingBox.width * tolerancePercent) / 100;
  const verticalTolerance =
    (containerBoundingBox.height * tolerancePercent) / 100;
  const receivedCenter = getCenter(receivedBoundingBox);
  const containerCenter = getCenter(containerBoundingBox);

  const horizontallyCentered = isWithinTolerance(
    containerCenter.x,
    receivedCenter.x,
    horizontalTolerance,
  );
  const verticallyCentered = isWithinTolerance(
    containerCenter.y,
    receivedCenter.y,
    verticalTolerance,
  );

  const pass = horizontallyCentered && verticallyCentered;
  return {
    pass,
    message: () =>
      pass
        ? 'Element is fully centered within container.'
        : getCenterMessage(
            containerBoundingBox,
            receivedBoundingBox,
            tolerancePercent,
          ),
  };
}
