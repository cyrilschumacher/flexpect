import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { HorizontalAlignment, toBeHorizontallyAlignedWith } from '@flexpect/matchers/horizontally-align-with';
import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeHorizontallyAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when the element is left aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Left, tolerancePercent: 0 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when the element is right aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 150, y: 0, width: 50, height: 100 };
    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Right, tolerancePercent: 0 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when the element is center aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 75, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 0 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should fail when the element is not left aligned within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Left, tolerancePercent: 0 };

    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to be left-aligned within 0% tolerance (±0.00px), but received a delta of 10.00px.',
    );
  });

  it('should fail when the element is not center aligned within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 60, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 0 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to be center-aligned within 0% tolerance (±0.00px), but received a delta of 15.00px.',
    );
  });

  it('should fail when the element is not right aligned within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 140, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Right, tolerancePercent: 0 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.message()).toBe(
      'Expected element to be right-aligned within 0% tolerance (±0.00px), but received a delta of 10.00px.',
    );
    expect(result.pass).toBe(false);
  });

  it('should pass when the element is center aligned within non-zero tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 70, y: 0, width: 50, height: 100 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 5 };
    const result = await toBeHorizontallyAlignedWith(element, container, options);

    expect(result.message()).toBe('Element is properly aligned.');
    expect(result.pass).toBe(true);
  });

  it('should throw an error when the element bounding box is null', async () => {
    const element = { toString: () => 'element' } as Locator;
    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => {
        throw new Error('No bounding box');
      });

    const container = {} as Locator;
    await expect(toBeHorizontallyAlignedWith(element, container)).rejects.toThrow('No bounding box');
  });

  it('should throw an error when the alignment is unknown', async () => {
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
    await expect(toBeHorizontallyAlignedWith(element, container, options)).rejects.toThrow(
      'Unknown horizontal alignment: invalid-alignment',
    );
  });
});
