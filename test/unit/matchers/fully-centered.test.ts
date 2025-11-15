import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toBeFullyCentered } from '@flexpect/matchers/fully-centered';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { ToleranceUnit } from '@flexpect/matchers/tolerance';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeFullyCentered', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is fully centered within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 50, y: 50, width: 100, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toBeFullyCentered(element, container);

    expect(result.message()).toEqual('Element is perfectly centered.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is not centered within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 80, y: 80, width: 100, height: 100 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    const result = await toBeFullyCentered(element, container, options);

    expect(result.message()).toEqual(
      `Element is not fully centered within the container (allowed tolerance: ±5%).

Details:
- Horizontal: 30.00px (tolerance: ±10.00px)
- Vertical:   30.00px (tolerance: ±10.00px)

Adjust the element position to bring it closer to the container's center.`,
    );
    expect(result.pass).toBe(false);
  });

  it('should throw an error for invalid tolerance in percent', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Percent };

    await expect(toBeFullyCentered(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  it('should throw an error for invalid tolerance in pixels', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const options = { tolerance: -10, toleranceUnit: ToleranceUnit.Pixels };

    await expect(toBeFullyCentered(element, container, options)).rejects.toThrow(
      '"tolerance" must be greater than or equal to 0',
    );
  });

  describe('with tolerance in pixels', () => {
    it('should pass when element is close to center within container', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 60, width: 100, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeFullyCentered(element, container, options);

      expect(result.message()).toEqual('Element is perfectly centered with a tolerance of 10px.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is far from center within container', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 60, width: 100, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Pixels };
      const result = await toBeFullyCentered(element, container, options);

      expect(result.message()).toEqual(`Element is not fully centered within the container (allowed tolerance: ±5px).

Details:
- Horizontal: 10.00px (tolerance: ±5.00px)
- Vertical:   10.00px (tolerance: ±5.00px)

Adjust the element position to bring it closer to the container's center.`);
      expect(result.pass).toBe(false);
    });
  });

  describe('with tolerance in percentage', () => {
    it('should pass when element is close to center within container', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 60, width: 100, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeFullyCentered(element, container, options);

      expect(result.message()).toEqual('Element is perfectly centered with a tolerance of 15%.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is far from center within container', async () => {
      const element = {} as Locator;
      const elementBox = { x: 60, y: 60, width: 100, height: 100 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

      const container = {} as Locator;
      const containerBox = { x: 0, y: 0, width: 200, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

      const options = { tolerance: 1, toleranceUnit: ToleranceUnit.Percent };
      const result = await toBeFullyCentered(element, container, options);

      expect(result.message()).toEqual(`Element is not fully centered within the container (allowed tolerance: ±1%).

Details:
- Horizontal: 10.00px (tolerance: ±2.00px)
- Vertical:   10.00px (tolerance: ±2.00px)

Adjust the element position to bring it closer to the container's center.`);
      expect(result.pass).toBe(false);
    });
  });
});
