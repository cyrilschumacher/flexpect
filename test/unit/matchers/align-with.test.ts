import { Alignment, Axis, toBeAlignedWith } from '@flexpect/matchers/aligned-with';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is aligned at start horizontally within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 250, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 102, y: 250, width: 200, height: 50 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { axis: Axis.Horizontal, mode: Alignment.Start, tolerancePercent: 5 };
    const result = await toBeAlignedWith(element, container, options);

    expect(result.pass).toBe(true);
    expect(result.message()).toContain('aligned (start) along horizontal axis');
  });

  it('should fail when element is not aligned at start horizontally', async () => {
    const element = {} as Locator;
    const elementBox = { x: 120, y: 250, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 250, width: 200, height: 50 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { axis: Axis.Horizontal, mode: Alignment.Start, tolerancePercent: 1 };
    const result = await toBeAlignedWith(element, container, options);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Expected element to be aligned (start) along horizontal axis');
  });

  it('should pass when element is aligned at center vertically within tolerance', async () => {
    const element = {} as Locator;
    const elementBox = { x: 150, y: 400, width: 50, height: 400 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 200, width: 200, height: 400 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { axis: Axis.Vertical, mode: Alignment.Center, tolerancePercent: 50 };
    const result = await toBeAlignedWith(element, container, options);

    expect(result.pass).toBe(true);
  });

  it('should fail when element is not aligned at end vertically', async () => {
    const element = {} as Locator;
    const elementBox = { x: 150, y: 500, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 200, width: 200, height: 400 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { axis: Axis.Vertical, mode: Alignment.End, tolerancePercent: 1 };
    const result = await toBeAlignedWith(element, container, options);

    expect(result.pass).toBe(false);
  });

  it('should use default options when not provided', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 200, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 200, width: 200, height: 400 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const result = await toBeAlignedWith(element, container);

    expect(result.pass).toBe(true);
    expect(result.message()).toContain('aligned (start) along horizontal axis');
  });

  it('should throw error for invalid axis', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 200, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 200, width: 200, height: 400 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { axis: 'diagonal' as Axis };
    await expect(toBeAlignedWith(element, container, options)).rejects.toThrow("Invalid axis: 'diagonal'.");
  });

  it('should throw error for invalid mode', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 200, width: 50, height: 50 };

    const container = {} as Locator;
    const containerBox = { x: 100, y: 200, width: 200, height: 400 };

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => elementBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(container)
      .mockImplementationOnce(async () => containerBox);

    const options = { mode: 'middle' as Alignment };
    await expect(toBeAlignedWith(element, container, options)).rejects.toThrow('Invalid alignment mode: middle');
  });
});
