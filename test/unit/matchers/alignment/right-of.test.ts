import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';

import { toBeRightOf } from '@matchers/alignment/right-of';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@helpers/tolerance';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toBeRightOf', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeRightOf(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;
    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeRightOf(element, reference, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should pass when element is strictly to the right of the reference', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 200, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

    const result = await toBeRightOf(element, reference);

    expect(result.message()).toEqual('Element is strictly to the right of the reference.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element left exactly touches reference right', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 150, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

    const result = await toBeRightOf(element, reference);

    expect(result.message()).toEqual('Element is strictly to the right of the reference.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is to the left of the reference', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 80, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

    const result = await toBeRightOf(element, reference);

    expect(result.message()).toEqual(`Element is not to the right of the reference.

Details:
- Allowed deviation: ≤ 0.00px (0%)
- Actual deviation:  -70.00px

To fix this, move the element rightward or increase the tolerance.`);
    expect(result.pass).toBe(false);
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is to the right within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 195, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 100, width: 100, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeRightOf(element, reference, options);

      expect(result.message()).toEqual('Element is to the right of the reference within 10% tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is to the left beyond percent tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 170, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 100, width: 100, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeRightOf(element, reference, options);

      expect(result.message()).toEqual(`Element is not to the right of the reference.

Details:
- Allowed deviation: ≤ 10.00px (10%)
- Actual deviation:  -30.00px

To fix this, move the element rightward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixel', () => {
    it('should pass when element is to the right within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 145, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeRightOf(element, reference, options);

      expect(result.message()).toEqual('Element is to the right of the reference within 10px tolerance.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is to the left beyond pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 125, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      getBoundingBoxOrFailMock.mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeRightOf(element, reference, options);

      expect(result.message()).toEqual(`Element is not to the right of the reference.

Details:
- Allowed deviation: ≤ 20.00px (20px)
- Actual deviation:  -25.00px

To fix this, move the element rightward or increase the tolerance.`);
      expect(result.pass).toBe(false);
    });
  });
});
