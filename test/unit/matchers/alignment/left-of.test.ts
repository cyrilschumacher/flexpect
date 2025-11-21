import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';

import { toBeLeftOf } from '@matchers/alignment/left-of';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@helpers/tolerance';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toBeLeftOf', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeLeftOf(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeLeftOf(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should pass when element is strictly to the left of the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 200, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeLeftOf(element, reference);

    expect(result.message()).toEqual('Element is strictly to the left of the reference.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element right exactly touches reference left', async () => {
    const element = {} as Locator;
    const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 150, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeLeftOf(element, reference);

    expect(result.message()).toEqual('Element is strictly to the left of the reference.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is to the right of the reference', async () => {
    const element = {} as Locator;
    const elementBox = { x: 210, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

    const reference = {} as Locator;
    const referenceBox = { x: 200, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

    const result = await toBeLeftOf(element, reference);

    expect(result.message()).toEqual(`Element is not to the left of the reference.

Details:
- Allowed deviation: ≤ 0.00px (0%)
- Actual deviation:  -60.00px

To fix this, move the element leftward or increase the tolerance.`);
    expect(result.pass).toBe(false);
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is to the left within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 145, y: 100, width: 100, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeLeftOf(element, reference, options);

      expect(result.message()).toEqual('Element is to the left of the reference within 10% tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is to the right beyond percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 180, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 200, y: 100, width: 100, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeLeftOf(element, reference, options);

      expect(result.message()).toEqual(`Element is not to the left of the reference.

Details:
- Allowed deviation: ≤ 10.00px (10%)
- Actual deviation:  -30.00px

To fix this, move the element leftward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixel', () => {
    it('should pass when element is to the left within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 145, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeLeftOf(element, reference, options);

      expect(result.message()).toEqual('Element is to the left of the reference within 10px tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is to the right beyond pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 175, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBox);

      const reference = {} as Locator;
      const referenceBox = { x: 200, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBox);

      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeLeftOf(element, reference, options);

      expect(result.message()).toEqual(`Element is not to the left of the reference.

Details:
- Allowed deviation: ≤ 20.00px (20px)
- Actual deviation:  -25.00px

To fix this, move the element leftward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });
});
