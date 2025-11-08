import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { toBeVerticallyAlignedWith, VerticalAlignment } from '@flexpect/matchers/vertically-align-with';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

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

    const options = { tolerance: 0, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top, options);

    expect(result.message()).toEqual('Element is properly top-aligned within the allowed tolerance (0%).');
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

    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Bottom, options);

    expect(result.message()).toEqual('Element is properly bottom-aligned within the allowed tolerance (10%).');
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

    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Center, options);

    expect(result.message()).toEqual(
      `Element is not center-aligned within the allowed tolerance of 5%.

Details:
- Allowed delta: ±5.00px
- Actual delta:  6.00px

Please adjust the element's vertical position to reduce the alignment difference.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should throw an error for invalid tolerance in percentage', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top, options)).rejects.toThrow(
      'tolerance must be greater than 0',
    );
  });

  it('should throw an error if element bounding box is null', async () => {
    const element = { toString: () => 'element' } as Locator;
    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => {
        throw new Error('No bounding box');
      });

    const container = {} as Locator;
    const resultPromise = toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top);

    await expect(resultPromise).rejects.toThrow('No bounding box');
  });

  it('should throw an error on unknown alignment', async () => {
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

    await expect(
      toBeVerticallyAlignedWith(element, container, 'invalid-alignment' as VerticalAlignment),
    ).rejects.toThrow('Unknown vertical alignment: invalid-alignment');
  });
});
