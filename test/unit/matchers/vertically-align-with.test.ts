import * as boundingBoxModule from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

import { toBeVerticallyAlignedWith } from '@flexpect/matchers/vertically-align-with';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';

describe('toBeVerticallyAlignedWith', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass when element is top-aligned within container without tolerance', async () => {
    const elementBox = { x: 0, y: 10, width: 50, height: 50 };
    const containerBox = { x: 0, y: 10, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeVerticallyAlignedWith(element, container, 'top');

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
  });

  it('should pass when element is bottom-aligned within tolerance', async () => {
    const elementBox = { x: 0, y: 150, width: 50, height: 50 };
    const containerBox = { x: 0, y: 100, width: 200, height: 100 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeVerticallyAlignedWith(element, container, 'bottom', 10);

    expect(result.pass).toBe(true);
  });

  it('should fail when element is center-aligned but outside tolerance', async () => {
    const elementBox = { x: 0, y: 119, width: 50, height: 50 };
    const containerBox = { x: 0, y: 100, width: 200, height: 100 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeVerticallyAlignedWith(element, container, 'center', 5);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Expected element to be center-aligned');
  });

  it('should throw if element bounding box is null', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.reject(new Error('Bounding box missing')));

    const element = { toString: () => 'element' } as Locator;
    const container = {} as Locator;

    const resultPromise = toBeVerticallyAlignedWith(element, container);

    await expect(resultPromise).rejects.toThrow('Bounding box missing');
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

    await expect(toBeVerticallyAlignedWith(element, container, 'invalid-alignment' as never)).rejects.toThrow(
      'Unknown vertical alignment: invalid-alignment',
    );
  });
});
