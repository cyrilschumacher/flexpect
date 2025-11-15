import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { toBeInside } from '@flexpect/matchers/inside';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeInside', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is fully inside the container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 10, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeInside(element, container);

    expect(result.message()).toEqual('Element is properly inside the container.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element overflows on right and bottom', async () => {
    const element = {} as Locator;
    const elementBox = { x: 180, y: 180, width: 30, height: 30 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeInside(element, container);

    expect(result.message()).toEqual(
      `Element is not fully inside the container within the allowed tolerance of 0%.

Details:
- Horizontal overflow: 10.00px (allowed: ±0.00px)
- Vertical overflow:   10.00px (allowed: ±0.00px)

Please adjust the element's position or size to fit entirely inside the container.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeInside(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeInside(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in percentage', () => {
    it('should pass when element is slightly outside', async () => {
      const element = {} as Locator;
      const elementBox = { x: -2, y: -3, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 2, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeInside(element, container, options);

      expect(result.message()).toEqual('Element is properly inside the container with a tolerance of 2%.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element exceeds percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: -10, y: -10, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeInside(element, container, options);

      expect(result.message()).toEqual(`Element is not fully inside the container within the allowed tolerance of 3%.

Details:
- Horizontal overflow: 4.00px (allowed: ±6.00px)
- Vertical overflow:   4.00px (allowed: ±6.00px)

Please adjust the element's position or size to fit entirely inside the container.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixels', () => {
    it('should pass when element is slightly outside', async () => {
      const element = {} as Locator;
      const elementBox = { x: -2, y: -3, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeInside(element, container, options);

      expect(result.message()).toEqual('Element is properly inside the container with a tolerance of 3px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element exceeds percent tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: -10, y: -5, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeInside(element, container, options);

      expect(result.message())
        .toEqual(`Element is not fully inside the container within the allowed tolerance of 3.00px.

Details:
- Horizontal overflow: 7.00px (allowed: ±3.00px)
- Vertical overflow:   2.00px (allowed: ±3.00px)

Please adjust the element's position or size to fit entirely inside the container.`);
      expect(result.pass).toBe(false);
    });
  });
});
