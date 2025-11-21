import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveDistanceFrom, DistanceSide } from '@flexpect/matchers/at-distance-from';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveDistanceFrom', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when distance is exactly 100px from top edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 100, y: 350, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Top, 100);

    expect(result.message()).toEqual('Element is exactly top-aligned at 100px.');
    expect(result.pass).toBe(true);
  });

  it('should pass when distance is exactly 100px from right edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 300, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Right, 100);

    expect(result.message()).toEqual('Element is exactly right-aligned at 100px.');
    expect(result.pass).toBe(true);
  });

  it('should pass when distance is exactly 100px from bottom edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 100, y: 150, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 300, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Bottom, 100);

    expect(result.message()).toEqual('Element is exactly bottom-aligned at 100px.');
    expect(result.pass).toBe(true);
  });

  it('should pass when distance is exactly 100px from left edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 300, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Left, 100);

    expect(result.message()).toEqual('Element is exactly left-aligned at 100px.');
    expect(result.pass).toBe(true);
  });

  it('should fail when distance is too large from bottom edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 100, y: 100, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 100, y: 300, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Bottom, 100);

    expect(result.message())
      .toEqual(`Element is not bottom-aligned within the allowed tolerance of ±0% from the expected 100px.

Details:
- Expected distance: 100px
- Actual distance:   150.00px
- Allowed deviation: ±0.00px (±0%)
- Difference:        50.00px

To fix this, adjust the bottom position of the element (or the top of the reference) using margin, padding, or layout properties so the gap is closer to 100px.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when distance is too small from left edge', async () => {
    const element = {} as Locator;
    const elementBoundingBox = { x: 250, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const reference = {} as Locator;
    const referenceBoundingBox = { x: 400, y: 200, width: 100, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

    const result = await toHaveDistanceFrom(element, reference, DistanceSide.Left, 100);

    expect(result.message())
      .toEqual(`Element is not left-aligned within the allowed tolerance of ±0% from the expected 100px.

Details:
- Expected distance: 100px
- Actual distance:   50.00px
- Allowed deviation: ±0.00px (±0%)
- Difference:        -50.00px

To fix this, adjust the left position of the element (or the right of the reference) using margin, padding, or layout properties so the gap is closer to 100px.`);
    expect(result.pass).toBe(false);
  });

  it('should throw error for invalid tolerance', async () => {
    const element = {} as Locator;
    const reference = {} as Locator;

    const options = { tolerance: -5, toleranceUnit: ToleranceUnit.Pixels };
    await expect(toHaveDistanceFrom(element, reference, DistanceSide.Top, 100, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in pixels', () => {
    it('should pass when distance is within pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 100, y: 340, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toHaveDistanceFrom(element, reference, DistanceSide.Top, 100, options);

      expect(result.message()).toEqual('Element is top-aligned within the tolerance of ±10px from the expected 100px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when distance exceeds pixel tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 100, y: 320, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };

      const result = await toHaveDistanceFrom(element, reference, DistanceSide.Top, 100, options);

      expect(result.message())
        .toEqual(`Element is not top-aligned within the allowed tolerance of ±10px from the expected 100px.

Details:
- Expected distance: 100px
- Actual distance:   70.00px
- Allowed deviation: ±10.00px (±10px)
- Difference:        -30.00px

To fix this, adjust the top position of the element (or the bottom of the reference) using margin, padding, or layout properties so the gap is closer to 100px.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in percent', () => {
    it('should pass when distance is within percent tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 100, y: 345, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveDistanceFrom(element, reference, DistanceSide.Top, 100, options);

      expect(result.message()).toEqual('Element is top-aligned within the tolerance of ±10% from the expected 100px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when distance exceeds percent tolerance', async () => {
      const element = {} as Locator;
      const elementBoundingBox = { x: 100, y: 330, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const reference = {} as Locator;
      const referenceBoundingBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBoundingBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveDistanceFrom(element, reference, DistanceSide.Top, 100, options);

      expect(result.message())
        .toEqual(`Element is not top-aligned within the allowed tolerance of ±10% from the expected 100px.

Details:
- Expected distance: 100px
- Actual distance:   80.00px
- Allowed deviation: ±10.00px (±10%)
- Difference:        -20.00px

To fix this, adjust the top position of the element (or the bottom of the reference) using margin, padding, or layout properties so the gap is closer to 100px.`);
      expect(result.pass).toBe(false);
    });
  });
});
