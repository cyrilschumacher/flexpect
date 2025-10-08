import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { toBeVerticallyAlignedWith, VerticalAlignment } from '@flexpect/matchers/vertically-align-with';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeVerticallyAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is top-aligned within container without tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 10, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 10, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: VerticalAlignment.Top, tolerancePercent: 0 };
    const result = await toBeVerticallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is bottom-aligned within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 150, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 100, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: VerticalAlignment.Bottom, tolerancePercent: 10 };
    const result = await toBeVerticallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is center-aligned but outside tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 119, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 100, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: VerticalAlignment.Center, tolerancePercent: 5 };
    const result = await toBeVerticallyAlignedWith(element, container, options);

    expect(result.message()).toContain('Expected element to be center-aligned');
    expect(result.pass).toBe(false);
  });

  it('should throw if element bounding box is null', async () => {
    const element = { toString: () => 'element' } as Locator;
    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => {
        throw new Error('No bounding box');
      });

    const container = {} as Locator;
    const resultPromise = toBeVerticallyAlignedWith(element, container);

    await expect(resultPromise).rejects.toThrow('No bounding box');
  });

  it('should throw on unknown alignment', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 0, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: 'invalid-alignment' as never, tolerancePercent: 0 };
    await expect(toBeVerticallyAlignedWith(element, container, options)).rejects.toThrow(
      'Unknown vertical alignment: invalid-alignment',
    );
  });
});
