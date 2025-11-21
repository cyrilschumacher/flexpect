import { getBoundingBoxOrFail, BoundingBox } from '@helpers/get-bounding-box-or-fail';
import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';

describe('getBoundingBoxOrFail', () => {
  it('should return bounding box when available', async () => {
    const boundingBox = { x: 50, y: 20, height: 768, width: 1024 };

    const mockBoundingBoxMock = jest.fn<() => Promise<BoundingBox>>().mockResolvedValue(boundingBox);
    const mockLocator: jest.Mocked<Locator> = { boundingBox: mockBoundingBoxMock } as never;

    const boundingBoxPromise = getBoundingBoxOrFail(mockLocator);

    await expect(boundingBoxPromise).resolves.toEqual({ x: 50, y: 20, height: 768, width: 1024 });
  });

  it('should throw an exception when not available', async () => {
    const mockBoundingBoxMock = jest.fn<() => Promise<null>>().mockResolvedValue(null);
    const mockLocator: jest.Mocked<Locator> = { boundingBox: mockBoundingBoxMock, toString: () => 'element' } as never;

    const failingPromise = getBoundingBoxOrFail(mockLocator);

    await expect(failingPromise).rejects.toThrow(
      'Expected element located by "element" to have a bounding box, but none was returned. This could indicate that the element is not visible, not rendered, or detached from the DOM.',
    );
  });
});
