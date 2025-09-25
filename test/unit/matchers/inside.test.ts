import * as boundingBoxModule from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

import { toBeInside } from '@flexpect/matchers/inside';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';

describe('toBeInside', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass when element is fully inside the container without tolerance', async () => {
    const elementBox = { x: 10, y: 10, width: 50, height: 50 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeInside(element, container);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly inside the container.');
  });

  it('should pass when element is slightly outside but within tolerance', async () => {
    const elementBox = { x: -2, y: -3, width: 50, height: 50 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };
    const tolerancePercent = 5;

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeInside(element, container, tolerancePercent);

    expect(result.pass).toBe(true);
  });

  it('should fail when element is outside container beyond tolerance', async () => {
    const elementBox = { x: -20, y: 0, width: 50, height: 50 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };
    const tolerancePercent = 5;

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeInside(element, container, tolerancePercent);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Expected element to be fully inside the container');
  });

  it('should fail when element overflows on right and bottom', async () => {
    const elementBox = { x: 180, y: 180, width: 30, height: 30 };
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.resolve(elementBox))
      .mockImplementationOnce(() => Promise.resolve(containerBox));

    const element = {} as Locator;
    const container = {} as Locator;

    const result = await toBeInside(element, container);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('overflows');
  });

  it('should throw if element bounding box is null', async () => {
    jest
      .spyOn(boundingBoxModule, 'getBoundingBoxOrFail')
      .mockImplementationOnce(() => Promise.reject(new Error('Bounding box missing')));

    const element = { toString: () => 'element' } as Locator;
    const container = {} as Locator;

    const resultPromise = toBeInside(element, container);

    await expect(resultPromise).rejects.toThrow('Bounding box missing');
  });
});
