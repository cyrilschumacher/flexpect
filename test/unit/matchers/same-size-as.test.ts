import { describe, it, expect, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveSameSizeAs, ToHaveSameSizeAsOptions } from '@flexpect/matchers/same-size-as';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveSameSizeAs', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element and container have exactly the same size without tolerance', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    const elementBox = { width: 100, height: 200 };
    const containerBox = { width: 100, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toHaveSameSizeAs(element, container);

    expect(result.message()).toEqual('Element size matches the container size within the allowed tolerance (0%).');
    expect(result.pass).toBe(true);
  });

  it('should fail when element size differs from container without tolerance', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    const elementBox = { width: 105, height: 200 };
    const containerBox = { width: 100, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toHaveSameSizeAs(element, container);

    expect(result.message()).toEqual(
      `Element size differs from container size beyond the allowed tolerance of 0%.

Details:
- Width:  expected 100.00px ±0.00px, got 105.00px (delta: 5.00px)
- Height: expected 200.00px ±0.00px, got 200.00px (delta: 0.00px)

Please adjust the element's size to match the container.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should pass when element size differs but within tolerance', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    const elementBox = { width: 105, height: 210 };
    const containerBox = { width: 100, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options: ToHaveSameSizeAsOptions = { tolerancePercent: 10 };
    const result = await toHaveSameSizeAs(element, container, options);

    expect(result.message()).toEqual('Element size matches the container size within the allowed tolerance (10%).');
    expect(result.pass).toBe(true);
  });

  it('should fail when element size differs and exceeds tolerance', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    const elementBox = { width: 120, height: 230 };
    const containerBox = { width: 100, height: 200 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options: ToHaveSameSizeAsOptions = { tolerancePercent: 10 };
    const result = await toHaveSameSizeAs(element, container, options);

    expect(result.pass).toBe(false);
    expect(result.message()).toEqual(
      `Element size differs from container size beyond the allowed tolerance of 10%.

Details:
- Width:  expected 100.00px ±10.00px, got 120.00px (delta: 20.00px)
- Height: expected 200.00px ±20.00px, got 230.00px (delta: 30.00px)

Please adjust the element's size to match the container.`,
    );
  });

  it('should throw an error for invalid tolerance in percentage', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerancePercent: -10 };

    await expect(toHaveSameSizeAs(element, container, options)).rejects.toThrow(
      'tolerancePercent must be greater than 0',
    );
  });
});
