import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { HorizontalAlignment, toBeHorizontallyAlignedWith } from '@flexpect/matchers/horizontally-align-with';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

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

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Left);

    expect(result.message()).toEqual('Element is properly left-aligned within the allowed tolerance (0%).');
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

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Right);

    expect(result.message()).toEqual('Element is properly right-aligned within the allowed tolerance (0%).');
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

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center);

    expect(result.message()).toEqual('Element is properly center-aligned within the allowed tolerance (0%).');
    expect(result.pass).toBe(true);
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

    await expect(
      toBeHorizontallyAlignedWith(element, container, 'invalid-alignment' as HorizontalAlignment),
    ).rejects.toThrow('Unknown horizontal alignment: invalid-alignment');
  });

  describe('with tolerance in percent', () => {
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

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual('Element is properly center-aligned within the allowed tolerance (5%).');
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

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Left, options);

      expect(result.message()).toEqual(
        `Element is not left-aligned within the allowed tolerance of 3%.

Details:
- Allowed delta: ±6.00px
- Actual delta:  10.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
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

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual(
        `Element is not center-aligned within the allowed tolerance of 3%.

Details:
- Allowed delta: ±6.00px
- Actual delta:  15.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
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

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Right, options);

      expect(result.message()).toEqual(
        `Element is not right-aligned within the allowed tolerance of 3%.

Details:
- Allowed delta: ±6.00px
- Actual delta:  10.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
    });

    it('should throw an error for invalid tolerance', async () => {
      const element = {} as Locator;
      const container = {} as Locator;
      const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

      await expect(
        toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options),
      ).rejects.toThrow('tolerance must be greater than or equal to 0');
    });
  });

  describe('with tolerance in pixels', () => {
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

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual('Element is properly center-aligned within the allowed tolerance (5px).');
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

      const options = { tolerance: 9, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Left, options);

      expect(result.message()).toEqual(
        `Element is not left-aligned within the allowed tolerance of 9px.

Details:
- Allowed delta: ±9.00px
- Actual delta:  10.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
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

      const options = { tolerance: 9, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual(
        `Element is not center-aligned within the allowed tolerance of 9px.

Details:
- Allowed delta: ±9.00px
- Actual delta:  15.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
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

      const options = { tolerance: 9, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Right, options);

      expect(result.message()).toEqual(
        `Element is not right-aligned within the allowed tolerance of 9px.

Details:
- Allowed delta: ±9.00px
- Actual delta:  10.00px

Adjust the element's horizontal position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
    });

    it('should throw an error for invalid tolerance', async () => {
      const element = {} as Locator;
      const container = {} as Locator;
      const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

      await expect(
        toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options),
      ).rejects.toThrow('tolerance must be greater than or equal to 0');
    });
  });
});
