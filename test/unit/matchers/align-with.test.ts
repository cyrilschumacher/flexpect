import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { Alignment, Axis, toBeAlignedWith } from '@flexpect/matchers/aligned-with';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid tolerance in percentage', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerancePercent: -10 };

    await expect(toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options)).rejects.toThrow(
      'tolerancePercent must be greater than 0',
    );
  });

  describe('Axis.Horizontal', () => {
    it('should throw an error for invalid mode', async () => {
      const element = {} as Locator;
      const container = {} as Locator;

      const elementBox = { x: 100, y: 200, width: 50, height: 50 };
      const containerBox = { x: 100, y: 200, width: 200, height: 400 };

      when(getBoundingBoxOrFailMock)
        .calledWith(element)
        .mockImplementationOnce(async () => elementBox);
      when(getBoundingBoxOrFailMock)
        .calledWith(container)
        .mockImplementationOnce(async () => containerBox);

      await expect(toBeAlignedWith(element, container, Axis.Horizontal, 'unknown' as Alignment)).rejects.toThrow(
        'Invalid alignment mode: unknown',
      );
    });

    describe('Alignment.Center', () => {
      it('should pass when element is aligned at center horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 125, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center);

        expect(result.message()).toEqual('Element is aligned (center) along horizontal axis within 0% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at center horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 125, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 10 };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along horizontal axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at center horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 136, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, horizontal).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the horizontal axis.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('Alignment.End', () => {
      it('should pass when element is aligned at end horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 5 };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.End, options);

        expect(result.message()).toEqual('Element is aligned (end) along horizontal axis within 5% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at end horizontally within tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 140, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 10 };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.End, options);

        expect(result.message()).toEqual('Element is aligned (end) along horizontal axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at end horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 100, y: 200, width: 50, height: 50 };
        const containerBox = { x: 100, y: 200, width: 100, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.End);

        expect(result.message()).toEqual(
          `Element is misaligned with the container (end, horizontal).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  50.00px

To fix this, ensure the element is aligned to the container's end edge along the horizontal axis.`,
        );
        expect(result.pass).toBe(false);
      });
    });

    describe('Alignment.Start', () => {
      it('should pass when element is aligned at start horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 100, y: 250, width: 50, height: 50 };
        const containerBox = { x: 100, y: 250, width: 200, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Start);

        expect(result.message()).toEqual('Element is aligned (start) along horizontal axis within 0% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at start horizontally within tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 120, y: 250, width: 50, height: 50 };
        const containerBox = { x: 100, y: 250, width: 200, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Start, {
          tolerancePercent: 10,
        });

        expect(result.message()).toEqual('Element is aligned (start) along horizontal axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at start horizontally', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 120, y: 250, width: 50, height: 50 };
        const containerBox = { x: 100, y: 250, width: 200, height: 50 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Start);

        expect(result.message()).toEqual(
          `Element is misaligned with the container (start, horizontal).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  20.00px

To fix this, ensure the element is aligned to the container's start edge along the horizontal axis.`,
        );
        expect(result.pass).toBe(false);
      });
    });
  });

  describe('Axis.Vertical', () => {
    it('should throw error for invalid mode', async () => {
      const element = {} as Locator;
      const container = {} as Locator;

      const elementBox = { x: 150, y: 200, width: 50, height: 400 };
      const containerBox = { x: 100, y: 200, width: 200, height: 400 };

      when(getBoundingBoxOrFailMock)
        .calledWith(element)
        .mockImplementationOnce(async () => elementBox);
      when(getBoundingBoxOrFailMock)
        .calledWith(container)
        .mockImplementationOnce(async () => containerBox);

      await expect(toBeAlignedWith(element, container, Axis.Vertical, 'unknown' as Alignment)).rejects.toThrow(
        'Invalid alignment mode: unknown',
      );
    });

    describe('Alignment.Center', () => {
      it('should pass when element is aligned at center vertically', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 200, width: 50, height: 400 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center);

        expect(result.message()).toEqual('Element is aligned (center) along vertical axis within 0% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at center vertically within tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 230, width: 50, height: 400 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 10 };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along vertical axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at center vertically', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 250, width: 50, height: 400 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, vertical).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  50.00px

To fix this, ensure the element is aligned to the container's center edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('Alignment.End', () => {
      it('should pass when element is aligned at end vertically', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 400, width: 50, height: 200 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.End);

        expect(result.message()).toEqual('Element is aligned (end) along vertical axis within 0% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at end vertically within tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 405, width: 50, height: 200 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 10 };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.End, options);

        expect(result.message()).toEqual('Element is aligned (end) along vertical axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at end vertically', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 150, y: 500, width: 50, height: 200 };
        const containerBox = { x: 100, y: 200, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.End, { tolerancePercent: 5 });

        expect(result.message()).toEqual(`Element is misaligned with the container (end, vertical).

Details:
- Allowed deviation: ±20.00px (5%)
- Actual deviation:  100.00px

To fix this, ensure the element is aligned to the container's end edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('Alignment.Start', () => {
      it('should pass when element is aligned at start vertically', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 100, y: 100, width: 50, height: 50 };
        const containerBox = { x: 100, y: 100, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Start);

        expect(result.message()).toEqual('Element is aligned (start) along vertical axis within 0% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should pass when element is aligned at start vertically within tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 100, y: 102, width: 50, height: 50 };
        const containerBox = { x: 100, y: 100, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const options = { tolerancePercent: 10 };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Start, options);

        expect(result.message()).toEqual('Element is aligned (start) along vertical axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is not aligned at start vertically with no tolerance', async () => {
        const element = {} as Locator;
        const container = {} as Locator;

        const elementBox = { x: 100, y: 105, width: 50, height: 50 };
        const containerBox = { x: 100, y: 100, width: 200, height: 400 };

        when(getBoundingBoxOrFailMock)
          .calledWith(element)
          .mockImplementationOnce(async () => elementBox);
        when(getBoundingBoxOrFailMock)
          .calledWith(container)
          .mockImplementationOnce(async () => containerBox);

        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Start);

        expect(result.message()).toEqual(`Element is misaligned with the container (start, vertical).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  5.00px

To fix this, ensure the element is aligned to the container's start edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });
  });
});
