import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { toBeVerticallyAlignedWith, VerticalAlignment } from '@flexpect/matchers/vertically-align-with';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeVerticallyAlignedWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is top-aligned within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 10, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 10, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top);

    expect(result.message()).toEqual('Element is properly top aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is bottom-aligned within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 160, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 10, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Bottom);

    expect(result.message()).toEqual('Element is properly bottom aligned.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is center-aligned within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 0, y: 85, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 10, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Center);

    expect(result.message()).toEqual('Element is properly center aligned.');
    expect(result.pass).toBe(true);
  });

  it('should throw an error on unknown alignment', async () => {
    const element = {} as Locator;
    const container = {} as Locator;

    await expect(
      toBeVerticallyAlignedWith(element, container, 'invalid-alignment' as VerticalAlignment),
    ).rejects.toThrow('Unknown vertical alignment: invalid-alignment');
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeVerticallyAlignedWith(element, container, VerticalAlignment.Top, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in percent', () => {
    it('should pass when element is bottom-aligned within tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 150, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 100, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Bottom, options);

      expect(result.message()).toEqual('Element is properly bottom aligned with a tolerance of 10%.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is center-aligned but outside tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 119, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 100, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Center, options);

      expect(result.message()).toEqual(
        `Element is not center-aligned within the allowed tolerance of 5%.

Details:
- Allowed delta: ±5.00px
- Actual delta:  6.00px

Please adjust the element's vertical position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in pixels', () => {
    it('should pass when element is bottom-aligned within tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 150, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 100, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 100, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Bottom, options);

      expect(result.message()).toEqual('Element is properly bottom aligned with a tolerance of 100px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is center-aligned but outside tolerance', async () => {
      const element = {} as Locator;
      const elementBox = { x: 0, y: 119, width: 50, height: 50 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 100, width: 200, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeVerticallyAlignedWith(element, container, VerticalAlignment.Center, options);

      expect(result.message()).toEqual(
        `Element is not center-aligned within the allowed tolerance of 5px.

Details:
- Allowed delta: ±5.00px
- Actual delta:  6.00px

Please adjust the element's vertical position to reduce the alignment difference.`,
      );
      expect(result.pass).toBe(false);
    });
  });
});
