import { describe, it, expect, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveSpacingBetween, SpacingAxis } from '@matchers/layout/spacing-between';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@helpers/tolerance';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toHaveSpacingBetween', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with horizontal spacing', () => {
    it('should pass when horizontal spacing is exact and element is left-aligned', async () => {
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

    it('should pass when horizontal spacing is exact with reference on the left', async () => {
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

    it('should fail when horizontal spacing is too large and element is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 80, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  20.00px
- Difference:        10.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=80.00, width=30.00px
- Gap between:       20.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when horizontal spacing is too large and reference is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 80, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  20.00px
- Difference:        10.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=80.00, width=30.00px
- Gap between:       20.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when horizontal spacing is too small and element is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 65, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  5.00px
- Difference:        5.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=65.00, width=30.00px
- Gap between:       5.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when horizontal spacing is too small and reference is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 65, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 10, y: 0, width: 50, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  5.00px
- Difference:        5.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=65.00, width=30.00px
- Gap between:       5.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when elements overlap horizontally with gap equal to 0 and element is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 10, y: 0, width: 60, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 50, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  0.00px
- Difference:        10.00px
- Left element:      X=10.00, width=60.00px
- Right element:     X=50.00, width=30.00px
- Gap between:       0.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when elements overlap horizontally with gap equal to 0 and reference is left-aligned', async () => {
      const element = {} as Locator;
      const elementBox = { x: 50, y: 0, width: 30, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 10, y: 0, width: 60, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal);

      expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  0.00px
- Difference:        10.00px
- Left element:      X=10.00, width=60.00px
- Right element:     X=50.00, width=30.00px
- Gap between:       0.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    describe('with tolerance in percent', () => {
      it('should pass when horizontal spacing is exact', async () => {
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

      it('should fail when horizontal spacing is not exact', async () => {
        const element = {} as Locator;
        const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 71, y: 0, width: 30, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
        const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options);

        expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±5%
- Measured spacing:  11.00px
- Difference:        1.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=71.00, width=30.00px
- Gap between:       11.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('with tolerance in pixels', () => {
      it('should pass when horizontal spacing is exact', async () => {
        const element = {} as Locator;
        const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 71, y: 0, width: 30, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 11, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Horizontal, options);

        expect(result.message()).toEqual(
          'Element spacing on the horizontal axis is 11.00px, within ±11px (±11.00px) of the expected 10px.',
        );
        expect(result.pass).toBe(true);
      });

      it('should fail when horizontal spacing is not exact', async () => {
        const element = {} as Locator;
        const elementBox = { x: 10, y: 0, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 71, y: 0, width: 30, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 1, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toHaveSpacingBetween(element, reference, 5, SpacingAxis.Horizontal, options);

        expect(result.message()).toEqual(`Horizontal spacing between elements does not match expected value.

Details:
- Expected spacing:  5.00px ±1px
- Measured spacing:  11.00px
- Difference:        6.00px
- Left element:      X=10.00, width=50.00px
- Right element:     X=71.00, width=30.00px
- Gap between:       11.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
        expect(result.pass).toBe(false);
      });
    });
  });

  describe('with vertical spacing', () => {
    it('should pass when vertical spacing is exact and element is on top', async () => {
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

    it('should pass when vertical spacing is exact and reference is on top', async () => {
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

    it('should fail when vertical spacing is too large and element is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 80, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  20.00px
- Difference:        10.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=80.00, height=30.00px
- Gap between:       20.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when vertical spacing is too large and reference is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 80, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  20.00px
- Difference:        10.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=80.00, height=30.00px
- Gap between:       20.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when vertical spacing is too small and element is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 65, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  5.00px
- Difference:        5.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=65.00, height=30.00px
- Gap between:       5.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when vertical spacing is too small and reference is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 65, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 10, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  5.00px
- Difference:        5.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=65.00, height=30.00px
- Gap between:       5.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when elements overlap vertically with gap equal to 0 and element is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 10, width: 100, height: 60 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 50, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  0.00px
- Difference:        10.00px
- Top element:       Y=10.00, height=60.00px
- Bottom element:    Y=50.00, height=30.00px
- Gap between:       0.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when elements overlap vertically with gap equal to 0 and reference is on top', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 50, width: 100, height: 30 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 0, y: 10, width: 100, height: 60 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

      const result = await toHaveSpacingBetween(element, reference, 10, SpacingAxis.Vertical);

      expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  10.00px ±0%
- Measured spacing:  0.00px
- Difference:        10.00px
- Top element:       Y=10.00, height=60.00px
- Bottom element:    Y=50.00, height=30.00px
- Gap between:       0.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
      expect(result.pass).toBe(false);
    });

    describe('with tolerance in percent', () => {
      it('should pass when vertical spacing is exact', async () => {
        const element = {} as Locator;
        const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 0, y: 70, width: 100, height: 30 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 50, toleranceUnit: ToleranceUnit.Percent };
        const result = await toHaveSpacingBetween(element, reference, 7, SpacingAxis.Vertical, options);

        expect(result.message()).toEqual(
          'Element spacing on the vertical axis is 10.00px, within ±50% (±3.50px) of the expected 7px.',
        );
        expect(result.pass).toBe(true);
      });

      it('should fail when vertical spacing is too large', async () => {
        const element = {} as Locator;
        const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 0, y: 70, width: 100, height: 30 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Percent };
        const result = await toHaveSpacingBetween(element, reference, 7, SpacingAxis.Vertical, options);

        expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  7.00px ±20%
- Measured spacing:  10.00px
- Difference:        3.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=70.00, height=30.00px
- Gap between:       10.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('with tolerance in pixels', () => {
      it('should pass when vertical spacing is exact', async () => {
        const element = {} as Locator;
        const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 0, y: 70, width: 100, height: 30 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toHaveSpacingBetween(element, reference, 5, SpacingAxis.Vertical, options);

        expect(result.message()).toEqual(
          'Element spacing on the vertical axis is 10.00px, within ±5px (±5.00px) of the expected 5px.',
        );
        expect(result.pass).toBe(true);
      });

      it('should fail when vertical spacing is too large', async () => {
        const element = {} as Locator;
        const elementBox = { x: 0, y: 10, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const reference = {} as Locator;
        const referenceBox = { x: 0, y: 70, width: 100, height: 30 } as never;
        when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

        const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toHaveSpacingBetween(element, reference, 3, SpacingAxis.Vertical, options);

        expect(result.message()).toEqual(`Vertical spacing between elements does not match expected value.

Details:
- Expected spacing:  3.00px ±5px
- Measured spacing:  10.00px
- Difference:        7.00px
- Top element:       Y=10.00, height=50.00px
- Bottom element:    Y=70.00, height=30.00px
- Gap between:       10.00px

Use margin, padding, or flex/grid gap to adjust spacing.`);
        expect(result.pass).toBe(false);
      });
    });
  });
});
