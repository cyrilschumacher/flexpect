import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';

import { toBeBelow } from '@flexpect/matchers/below';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeBelow', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeBelow(element, reference, options)).rejects.toThrow(
      'tolerance must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeBelow(element, reference, options)).rejects.toThrow(
      'tolerance must be greater than or equal to 0',
    );
  });

  it('should pass when element is strictly below the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 200, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeBelow(element, reference);

    expect(result.message()).toEqual('Element is strictly below the reference.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element top exactly touches reference bottom', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 150, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeBelow(element, reference);

    expect(result.message()).toEqual('Element is strictly below the reference.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is above the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 90, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeBelow(element, reference);

    expect(result.message()).toEqual(`Element is not below the reference.

Details:
- Allowed deviation: ≤ 0.00px (0%)
- Actual deviation: -60.00px

To fix this, move the element downward or increase the tolerance.`);
    expect(result.pass).toBe(false);
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is below within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 195, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 100, width: 50, height: 100 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeBelow(element, reference, options);

      expect(result.message()).toEqual('Element is below the reference within 10% tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is above beyond percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 170, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 100, width: 50, height: 100 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeBelow(element, reference, options);

      expect(result.message()).toEqual(`Element is not below the reference.

Details:
- Allowed deviation: ≤ 10.00px (10%)
- Actual deviation: -30.00px

To fix this, move the element downward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixel', () => {
    it('should pass when element is below within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 195, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 100, width: 50, height: 100 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeBelow(element, reference, options);

      expect(result.message()).toEqual('Element is below the reference within 10px tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is above beyond pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 125, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeBelow(element, reference, options);

      expect(result.message()).toEqual(`Element is not below the reference.

Details:
- Allowed deviation: ≤ 20.00px (20px)
- Actual deviation: -25.00px

To fix this, move the element downward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });
});
