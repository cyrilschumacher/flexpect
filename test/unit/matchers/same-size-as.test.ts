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

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element is properly aligned.');
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

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Expected element to have same size as reference within 0% tolerance');
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
    expect(result.message()).toContain('Expected element to have same size as reference within 10% tolerance');
  });

  it('should correctly format failure message with size details', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    const elementBox = { width: 120, height: 150 };
    const containerBox = { width: 100, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options: ToHaveSameSizeAsOptions = { tolerancePercent: 10 };
    const result = await toHaveSameSizeAs(element, container, options);

    const message = result.message();
    expect(message).toContain('Width: expected 100.00px ±10.00px, but received 120.00px (delta: 20.00px)');
    expect(message).toContain('Height: expected 100.00px ±10.00px, but received 150.00px (delta: 50.00px)');
  });
});
