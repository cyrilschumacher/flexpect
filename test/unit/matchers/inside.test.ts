import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { toBeInside } from '@flexpect/matchers/inside';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeInside', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is fully inside the container without tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 10, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toBeInside(element, container);

    expect(result.message()).toEqual('Element is properly inside the container within the allowed tolerance (0%).');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is slightly outside but within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: -2, y: -3, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeInside(element, container, options);

    expect(result.message()).toEqual('Element is properly inside the container within the allowed tolerance (5%).');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is outside container beyond tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: -20, y: 0, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeInside(element, container, options);

    expect(result.message()).toEqual(
      `Element is not fully inside the container within the allowed tolerance of 5%.

Details:
- Horizontal overflow: 10.00px
- Vertical overflow:   0.00px
- Allowed tolerance:   ±10.00px

Please adjust the element's position or size to fit entirely inside the container.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should fail when element overflows on right and bottom', async () => {
    const element = {} as Locator;
    const elementBox = { x: 180, y: 180, width: 30, height: 30 };

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toBeInside(element, container);

    expect(result.message()).toEqual(
      `Element is not fully inside the container within the allowed tolerance of 0%.

Details:
- Horizontal overflow: 10.00px
- Vertical overflow:   10.00px
- Allowed tolerance:   ±0.00px

Please adjust the element's position or size to fit entirely inside the container.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should throw an error if element bounding box is null', async () => {
    const element = { toString: () => 'element' } as Locator;
    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => {
        throw new Error('No bounding box');
      });

    const container = {} as Locator;
    await expect(toBeInside(element, container)).rejects.toThrow('No bounding box');
  });
});
