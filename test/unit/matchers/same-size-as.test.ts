import { describe, it, expect, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveSameSizeAs } from '@flexpect/matchers/same-size-as';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveSameSizeAs', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element and container have exactly the same size', async () => {
    const element = {} as Locator;
    const elementBox = { width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toHaveSameSizeAs(element, container);

    expect(result.message()).toEqual('Element size matches the container size exactly.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element size differs from container', async () => {
    const element = {} as Locator;
    const elementBox = { width: 105, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toHaveSameSizeAs(element, container);

    expect(result.message()).toEqual(
      `Element size differs from container size beyond the allowed tolerance of 0%.

Details:
- Width:  expected 100.00px ±0.00px, got 105.00px (delta: 5.00px)
- Height: expected 200.00px ±0.00px, got 200.00px (delta: 0.00px)

Please adjust the element's size to match the container.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toHaveSameSizeAs(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toHaveSameSizeAs(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in percent', () => {
    it('should pass when element size differs', async () => {
      const element = {} as Locator;
      const elementBox = { width: 105, height: 210 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { width: 100, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSameSizeAs(element, container, options);

      expect(result.message()).toEqual('Element size fits the container perfectly with a tolerance of 5%.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element width differs and exceeds tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { width: 115, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { width: 100, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSameSizeAs(element, container, options);

      expect(result.pass).toBe(false);
    });

    it('should fail when element height differs and exceeds tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { width: 100, height: 230 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { width: 100, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toHaveSameSizeAs(element, container, options);

      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixel', () => {
    it('should pass when element size differs but within tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { width: 105, height: 205 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { width: 100, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toHaveSameSizeAs(element, container, options);

      expect(result.message()).toEqual('Element size fits the container perfectly with a tolerance of 5px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element size differs and exceeds tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { width: 120, height: 230 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { width: 100, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toHaveSameSizeAs(element, container, options);

      expect(result.message()).toEqual(`Element size differs from container size beyond the allowed tolerance of 5px.

Details:
- Width:  expected 100.00px ±5.00px, got 120.00px (delta: 20.00px)
- Height: expected 200.00px ±5.00px, got 230.00px (delta: 30.00px)

Please adjust the element's size to match the container.`);
      expect(result.pass).toBe(false);
    });
  });
});
