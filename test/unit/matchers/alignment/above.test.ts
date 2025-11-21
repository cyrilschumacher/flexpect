import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';

import { toBeAbove } from '@matchers/alignment/above';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@helpers/tolerance';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toBeAbove', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeAbove(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeAbove(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should pass when element is strictly above the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never; // bottom: 150
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 200, width: 50, height: 50 } as never; // top: 200
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeAbove(element, reference);

    expect(result.message()).toEqual('Element is strictly above the reference.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element bottom exactly touches reference top', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 150, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 200, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeAbove(element, reference);

    expect(result.message()).toEqual('Element is strictly above the reference.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is below the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 210, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 200, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeAbove(element, reference);

    expect(result.message()).toEqual(`Element is not above the reference.

Details:
- Allowed deviation: ≤ 0.00px (0%)
- Actual deviation:  -60.00px

To fix this, move the element upward or increase the tolerance.`);
    expect(result.pass).toBe(false);
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is above within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 145, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 200, width: 50, height: 100 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeAbove(element, reference, options);

      expect(result.message()).toEqual('Element is above the reference within 10% tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is below beyond percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 180, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 200, width: 50, height: 100 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeAbove(element, reference, options);

      expect(result.message()).toEqual(`Element is not above the reference.

Details:
- Allowed deviation: ≤ 10.00px (10%)
- Actual deviation:  -30.00px

To fix this, move the element upward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixel', () => {
    it('should pass when element is above within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 195, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 250, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeAbove(element, reference, options);

      expect(result.message()).toEqual('Element is above the reference within 10px tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is below beyond pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 195, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 100, y: 200, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeAbove(element, reference, options);

      expect(result.message()).toEqual(`Element is not above the reference.

Details:
- Allowed deviation: ≤ 20.00px (20px)
- Actual deviation:  -45.00px

To fix this, move the element upward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });
});
