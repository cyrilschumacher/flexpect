import * as boundingBoxModule from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

import { toBeFullyCentered } from '@flexpect/matchers/fully-centered';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';

describe('toBeFullyCentered', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass when element is fully centered within container', async () => {
    const elementBox = { x: 50, y: 50, width: 100, height: 100 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeFullyCentered(element, container);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is fully centered within container.');
  });

  it('should fail when element is not centered within tolerance', async () => {
    const elementBox = { x: 80, y: 80, width: 100, height: 100 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeFullyCentered(element, container, 5);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Expected element to be centered within container');
  });

  it('should pass when element is slightly off-center but within custom tolerance', async () => {
    const elementBox = { x: 60, y: 60, width: 100, height: 100 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeFullyCentered(element, container, 15);

    expect(result.pass).toBe(true);
  });

  it('should throw if container bounding box is null', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 100, height: 100 }))
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Expected element located by "container" to have a bounding box')),
      );

    const element = {} as Locator;
    const container = { toString: () => 'container' } as Locator;

    const resultPromise = toBeFullyCentered(element, container);

    await expect(resultPromise).rejects.toThrow('Expected element located by "container" to have a bounding box');
  });
});
