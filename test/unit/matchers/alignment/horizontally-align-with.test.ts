import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { HorizontalAlignment, toBeHorizontallyAlignedWith } from '@matchers/alignment/horizontally-align-with';
import { ToleranceUnit } from '@helpers/tolerance';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toBeHorizontallyAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is left aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 0, width: 50, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Left);

    expect(result.message()).toEqual('Element is perfectly left-aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is right aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 150, y: 0, width: 50, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Right);

    expect(result.message()).toEqual('Element is perfectly right-aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is center aligned', async () => {
    const element = {} as Locator;
    const elementBox = { x: 75, y: 0, width: 50, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center);

    expect(result.message()).toEqual('Element is perfectly center-aligned.');
    expect(result.pass).toBe(true);
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is center aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 70, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual('Element is properly center-aligned within the allowed tolerance (5%).');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is not left aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    it('should fail when element is not center aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    it('should fail when element is not right aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 140, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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
  });

  describe('with tolerance in pixels', () => {
    it('should pass when element is center aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 70, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeHorizontallyAlignedWith(element, container, HorizontalAlignment.Center, options);

      expect(result.message()).toEqual('Element is properly center-aligned within the allowed tolerance (5px).');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is not left aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    it('should fail when element is not center aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    it('should fail when element is not right aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 140, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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
  });
});
