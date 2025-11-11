import { describe, it, expect, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveSpacingBetween, SpacingAxis } from '@flexpect/matchers/spacing-between';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveSpacingBetween', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percentage', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options)).rejects.toThrow(
      'tolerance must be greater than or equal to 0',
    );
  });

  describe('Horizontal spacing', () => {
    it('should pass when horizontal spacing is exact (element on the left)', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 70, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual('Element spacing on the horizontal axis is exactly 10.00px as expected.');
      expect(result.pass).toBe(true);
    });

    it('should pass when horizontal spacing is exact (reference on the left)', async () => {
      const element = {} as Locator;
      const elementBox = { x: 70, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual('Element spacing on the horizontal axis is exactly 10.00px as expected.');
      expect(result.pass).toBe(true);
    });

    it('should pass when spacing is within tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 71, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options);

      expect(result.message()).toEqual(
        'Element spacing on the horizontal axis is 11.00px, within ±10% (±1.00px) of the expected 10px.',
      );
      expect(result.pass).toBe(true);
    });

    it('should fail when horizontal spacing is too small', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 65, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(
        `Horizontal spacing between elements does not match expected value.\n\n` +
          `Expected:     10.00px ±0%\n` +
          `Measured:     5.00px\n` +
          `Difference:   5.00px\n\n` +
          `Layout details (X axis):\n` +
          `- Left element:   X=10.00, width=50.00px\n` +
          `- Right element:  X=65.00, width=30.00px\n` +
          `- Gap between:    5.00px\n\n` +
          `Use margin, padding, or flex/grid gap to adjust spacing.`,
      );
      expect(result.pass).toBe(false);
    });

    it('should fail when elements overlap horizontally (gap = 0)', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 60, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 50, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Expected:     10.00px ±0%
Measured:     0.00px
Difference:   10.00px

Layout details (X axis):
- Left element:   X=10.00, width=60.00px
- Right element:  X=50.00, width=30.00px
- Gap between:    0.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('Vertical spacing', () => {
    it('should pass when vertical spacing is exact (element on top)', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 70, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual('Element spacing on the vertical axis is exactly 10.00px as expected.');
      expect(result.pass).toBe(true);
    });

    it('should pass when vertical spacing is exact (reference on top)', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 70, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual('Element spacing on the vertical axis is exactly 10.00px as expected.');
      expect(result.pass).toBe(true);
    });

    it('should fail when vertical spacing is too large', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 80, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.pass).toBe(false);
      expect(result.message()).toEqual(
        `Vertical spacing between elements does not match expected value.\n\n` +
          `Expected:     10.00px ±0%\n` +
          `Measured:     20.00px\n` +
          `Difference:   10.00px\n\n` +
          `Layout details (Y axis):\n` +
          `- Top element:    Y=10.00, height=50.00px\n` +
          `- Bottom element: Y=80.00, height=30.00px\n` +
          `- Gap between:    20.00px\n\n` +
          `Use margin, padding, or flex/grid gap to adjust spacing.`,
      );
    });
  });

  describe('Tolerance', () => {
    it('should pass when spacing difference is within tolerance percent', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 74, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 50, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options);

      expect(result.message()).toEqual(
        'Element spacing on the horizontal axis is 14.00px, within ±50% (±5.00px) of the expected 10px.',
      );
      expect(result.pass).toBe(true);
    });

    it('should fail when spacing difference exceeds tolerance percent', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 76, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 50, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Expected:     10.00px ±50%
Measured:     16.00px
Difference:   6.00px

Layout details (X axis):
- Left element:   X=10.00, width=50.00px
- Right element:  X=76.00, width=30.00px
- Gap between:    16.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });
  });
});
