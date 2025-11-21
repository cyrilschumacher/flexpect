import { describe, it, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { Alignment, Axis, toBeAlignedWith } from '@flexpect/matchers/aligned-with';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should throw an error for invalid mode', async () => {
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

    const alignment = 'unknown' as never as Alignment;
    await expect(toBeAlignedWith(element, container, Axis.Vertical, alignment)).rejects.toThrow(
      'Invalid alignment mode: unknown',
    );
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with horizontal alignment', () => {
    it('should pass when element is aligned at center horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 125, y: 200, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center);

      expect(result.message()).toEqual('Element is aligned (center) along horizontal axis.');
      expect(result.pass).toBe(true);
    });

    it('should pass when element is aligned at end horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 150, y: 200, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.End);

      expect(result.message()).toEqual('Element is aligned (end) along horizontal axis.');
      expect(result.pass).toBe(true);
    });

    it('should pass when element is aligned at start horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 250, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 250, width: 200, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Start);

      expect(result.message()).toEqual('Element is aligned (start) along horizontal axis.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is not aligned at center horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 136, y: 200, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center);

      expect(result.message()).toEqual(`Element is misaligned with the container (center, horizontal).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the horizontal axis.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when element is not aligned at end horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 200, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    it('should fail when element is not aligned at start horizontally', async () => {
      const element = {} as Locator;
      const elementBox = { x: 120, y: 250, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 250, width: 200, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

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

    describe('with tolerance in percent', () => {
      it('should pass when element is aligned at center horizontally', async () => {
        const element = {} as Locator;
        const elementBox = { x: 125, y: 200, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along horizontal axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is misaligned at center horizontally beyond percent tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 136, y: 200, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, horizontal).

Details:
- Allowed deviation: ±10.00px (10%)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the horizontal axis.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('with tolerance in pixels', () => {
      it('should pass when element is aligned at center horizontally', async () => {
        const element = {} as Locator;
        const elementBox = { x: 125, y: 200, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along horizontal axis within 10px tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is misaligned at center horizontally beyond pixel tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 136, y: 200, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 100, y: 200, width: 100, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Horizontal, Alignment.Center, options);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, horizontal).

Details:
- Allowed deviation: ±10.00px (10px)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the horizontal axis.`);
        expect(result.pass).toBe(false);
      });

      it('should pass when element is aligned at center vertically', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 125, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along vertical axis within 10px tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is misaligned at center vertically beyond pixel tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 136, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, vertical).

Details:
- Allowed deviation: ±10.00px (10px)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });
  });

  describe('with vertical alignment', () => {
    it('should pass when element is aligned at center vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 150, y: 200, width: 50, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center);

      expect(result.message()).toEqual('Element is aligned (center) along vertical axis.');
      expect(result.pass).toBe(true);
    });

    it('should pass when element is aligned at end vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 150, y: 400, width: 50, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.End);

      expect(result.message()).toEqual('Element is aligned (end) along vertical axis.');
      expect(result.pass).toBe(true);
    });

    it('should pass when element is aligned at start vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 100, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 100, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Start);

      expect(result.message()).toEqual('Element is aligned (start) along vertical axis.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is not aligned at center vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 150, y: 250, width: 50, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center);

      expect(result.message()).toEqual(`Element is misaligned with the container (center, vertical).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  50.00px

To fix this, ensure the element is aligned to the container's center edge along the vertical axis.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when element is not aligned at end vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 150, y: 500, width: 50, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 200, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.End, options);

      expect(result.message()).toEqual(`Element is misaligned with the container (end, vertical).

Details:
- Allowed deviation: ±20.00px (5%)
- Actual deviation:  100.00px

To fix this, ensure the element is aligned to the container's end edge along the vertical axis.`);
      expect(result.pass).toBe(false);
    });

    it('should fail when element is not aligned at start vertically', async () => {
      const element = {} as Locator;
      const elementBox = { x: 100, y: 105, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 100, y: 100, width: 200, height: 400 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Start);

      expect(result.message()).toEqual(`Element is misaligned with the container (start, vertical).

Details:
- Allowed deviation: ±0.00px (0%)
- Actual deviation:  5.00px

To fix this, ensure the element is aligned to the container's start edge along the vertical axis.`);
      expect(result.pass).toBe(false);
    });

    describe('with tolerance in percent', () => {
      it('should pass when element is aligned at center vertically within percent tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 125, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along vertical axis within 10% tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is misaligned at center vertically beyond percent tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 136, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, vertical).

Details:
- Allowed deviation: ±10.00px (10%)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });

    describe('with tolerance in pixels', () => {
      it('should pass when element is aligned at center vertically within pixel tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 125, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;
        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual('Element is aligned (center) along vertical axis within 10px tolerance.');
        expect(result.pass).toBe(true);
      });

      it('should fail when element is misaligned at center vertically beyond pixel tolerance', async () => {
        const element = {} as Locator;
        const elementBox = { x: 200, y: 136, width: 50, height: 50 } as never;
        when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

        const container = {} as Locator;
        const containerBox = { x: 200, y: 100, width: 50, height: 100 } as never;

        when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        const result = await toBeAlignedWith(element, container, Axis.Vertical, Alignment.Center, options);

        expect(result.message()).toEqual(`Element is misaligned with the container (center, vertical).

Details:
- Allowed deviation: ±10.00px (10px)
- Actual deviation:  11.00px

To fix this, ensure the element is aligned to the container's center edge along the vertical axis.`);
        expect(result.pass).toBe(false);
      });
    });
  });
});
