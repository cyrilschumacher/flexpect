import { Locator } from '@playwright/test';

class BoundingBoxError extends Error {
  constructor(element: Locator) {
    super(
      `Expected element located by "${element.toString()}" to have a bounding box, but none was returned. This could indicate that the element is not visible, not rendered, or detached from the DOM.`,
    );
    this.name = 'BoundingBoxError';
  }
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getBoundingBoxOrFail(element: Locator): Promise<BoundingBox> {
  const boundingBox = await element.boundingBox();
  if (boundingBox) {
    return boundingBox;
  }
  throw new BoundingBoxError(element);
}
