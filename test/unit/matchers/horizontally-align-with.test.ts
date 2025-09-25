import * as boundingBoxModule from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

import { toBeHorizontallyAlignedWith } from '@flexpect/matchers/horizontally-align-with';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';

describe('toBeHorizontallyAlignedWith (isolated)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass when element is left-aligned', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'left', 0);

    expect(result.pass).toBe(true);
  });

  it('should fail when element is not aligned within tolerance', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 10, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'left', 0);

    expect(result.pass).toBe(false);
  });

  it('should throw if element bounding box is null', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.reject(new Error('No bounding box')))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = { toString: () => 'element' } as Locator;
    const container = {} as Locator;

    const resultPromise = toBeHorizontallyAlignedWith(element, container);

    await expect(resultPromise).rejects.toThrow('No bounding box');
  });

  it('should throw on unknown alignment', async () => {
    const elementBox = { x: 0, y: 0, width: 50, height: 50 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    await expect(toBeHorizontallyAlignedWith(element, container, 'invalid-alignment' as never)).rejects.toThrow(
      'Unknown horizontal alignment: invalid-alignment',
    );
  });
});
