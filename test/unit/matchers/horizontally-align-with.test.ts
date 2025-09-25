import * as boundingBoxModule from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

import { toBeHorizontallyAlignedWith } from '@flexpect/matchers/horizontally-align-with';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';

describe('toBeHorizontallyAlignedWith', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass when the element is left aligned', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'left', 0);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
  });

  it('should pass when the element is right aligned', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 150, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'right', 0);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
  });

  it('should pass when the element is center aligned', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 75, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'center', 0);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
  });

  it('should fail when the element is not left aligned within tolerance', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 10, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'left', 0);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to be left-aligned within 0% tolerance (±0.00px), but received a delta of 10.00px.',
    );
  });

  it('should fail when the element is not center aligned within tolerance', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 60, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'center', 0);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to be center-aligned within 0% tolerance (±0.00px), but received a delta of 15.00px.',
    );
  });

  it('should fail when the element is not right aligned within tolerance', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 140, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'right', 0);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to be right-aligned within 0% tolerance (±0.00px), but received a delta of 10.00px.',
    );
  });

  it('should pass when the element is center aligned within non-zero tolerance', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve({ x: 70, y: 0, width: 50, height: 100 }))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeHorizontallyAlignedWith(element, container, 'center', 5);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
  });

  it('should throw an error when the element bounding box is null', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.reject(new Error('No bounding box')))
      .mockImplementationOnce(() => Promise.resolve({ x: 0, y: 0, width: 200, height: 100 }));

    const element = { toString: () => 'element' } as Locator;
    const container = {} as Locator;

    const resultPromise = toBeHorizontallyAlignedWith(element, container);

    await expect(resultPromise).rejects.toThrow('No bounding box');
  });

  it('should throw an error when the alignment is unknown', async () => {
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
