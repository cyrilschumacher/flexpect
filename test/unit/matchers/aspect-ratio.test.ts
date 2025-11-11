import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveAspectRatio } from '@flexpect/matchers/aspect-ratio';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveAspectRatio', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when aspect ratio matches exactly', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 16, height: 9 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(box);

    const result = await toHaveAspectRatio(element, 16 / 9);

    expect(result.message()).toEqual(
      'Element aspect ratio matches the expected value exactly, with 1.7778 actual and 1.7778 expected.',
    );
    expect(result.pass).toBe(true);
  });

  it('should fail when aspect ratio is outside tolerance', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 22, height: 20 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(box);

    const result = await toHaveAspectRatio(element, 1);

    expect(result.message()).toEqual(`Element's aspect ratio is outside the allowed 0% range.

Details:
- Expected ratio: ~1.0000
- Actual ratio:   1.1000
- Difference:     0.1000 (allowed: ±0.0000)

To fix this, adjust the element's width or height so that its ratio more closely matches the expected 1.0000.`);
    expect(result.pass).toBe(false);
  });

  describe('with tolerance in pixels', () => {
    it('should pass when aspect ratio is within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 0, width: 28, height: 20 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const options = { tolerance: 1, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toHaveAspectRatio(element, 4 / 3, options);

      expect(result.message()).toEqual(
        'Element aspect ratio is within 1px of the expected value, with 1.4000 actual, 1.3333 expected, and an offset of 0.0667.',
      );
      expect(result.pass).toBe(true);
    });

    it('should fail when aspect ratio is outside pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 0, width: 30, height: 20 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const options = { tolerance: 0, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toHaveAspectRatio(element, 4 / 3, options);

      expect(result.message()).toEqual(`Element's aspect ratio is outside the allowed 0px range.

Details:
- Expected ratio: ~1.3333
- Actual ratio:   1.5000
- Difference:     0.1667 (allowed: ±0.0000)

To fix this, adjust the element's width or height so that its ratio more closely matches the expected 1.3333.`);
      expect(result.pass).toBe(false);
    });

    it('should throw an error for invalid tolerance', async () => {
      const element = {} as Locator;
      const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

      await expect(toHaveAspectRatio(element, 16 / 9, options)).rejects.toThrow(
        'tolerance must be greater than or equal to 0',
      );
    });
  });

  describe('with tolerance in percent', () => {
    it('should pass when aspect ratio is within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 0, width: 27, height: 20 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveAspectRatio(element, 4 / 3, options);

      expect(result.message()).toEqual(
        'Element aspect ratio is within 5% of the expected value, with 1.3500 actual, 1.3333 expected, and an offset of 0.0167.',
      );
      expect(result.pass).toBe(true);
    });

    it('should fail when aspect ratio is outside percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 0, width: 28, height: 20 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const options = { tolerance: 2, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveAspectRatio(element, 4 / 3, options);

      expect(result.message()).toEqual(`Element's aspect ratio is outside the allowed 2% range.

Details:
- Expected ratio: ~1.3333
- Actual ratio:   1.4000
- Difference:     0.0667 (allowed: ±0.0267)

To fix this, adjust the element's width or height so that its ratio more closely matches the expected 1.3333.`);
      expect(result.pass).toBe(false);
    });

    it('should throw an error for invalid tolerance', async () => {
      const element = {} as Locator;
      const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

      await expect(toHaveAspectRatio(element, 16 / 9, options)).rejects.toThrow(
        'tolerance must be greater than or equal to 0',
      );
    });
  });
});
