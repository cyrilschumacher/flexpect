import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toBeFullyCentered } from '@flexpect/matchers/fully-centered';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeFullyCentered', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is fully centered within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 50, y: 50, width: 100, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toBeFullyCentered(element, container);

    expect(result.message()).toBe('Element is fully centered within container.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is not centered within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 80, y: 80, width: 100, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { tolerancePercent: 5 };
    const result = await toBeFullyCentered(element, container, options);

    expect(result.message()).toContain('Expected element to be centered within container');
    expect(result.pass).toBe(false);
  });

  it('should pass when element is slightly off-center but within custom tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 60, y: 60, width: 100, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { tolerancePercent: 15 };
    const result = await toBeFullyCentered(element, container, options);

    expect(result.message()).toBe('Element is fully centered within container.');
    expect(result.pass).toBe(true);
  });

  it('should throw if container bounding box is null', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 0, width: 100, height: 100 };

    const container = { toString: () => 'container' } as Locator;

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => {
        throw new Error('Expected element located by "container" to have a bounding box');
      });

    const resultPromise = toBeFullyCentered(element, container);

    await expect(resultPromise).rejects.toThrow('Expected element located by "container" to have a bounding box');
  });
});
