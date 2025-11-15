import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toFitContainer } from '@flexpect/matchers/fit-container';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toFitContainer', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element fits exactly within container', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 20, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.message()).toEqual('Element fits exactly within container.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element position differs', async () => {
    const element = {} as Locator;
    const elementBox = { x: 15, y: 25, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.message()).toEqual(`Element does not fit exactly within the container.

Details:
- Position delta: x = 5.00px, y = 5.00px
- Size delta:     width = 0.00px, height = 0.00px

Please ensure the element's position and size exactly match the container's.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when element size differs', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 20, width: 110, height: 190 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.message()).toEqual(`Element does not fit exactly within the container.

Details:
- Position delta: x = 0.00px, y = 0.00px
- Size delta:     width = 10.00px, height = -10.00px

Please ensure the element's position and size exactly match the container's.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when both position and size differ', async () => {
    const element = {} as Locator;
    const elementBox = { x: 12, y: 18, width: 120, height: 180 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);

    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 } as never;
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.message()).toEqual(`Element does not fit exactly within the container.

Details:
- Position delta: x = 2.00px, y = -2.00px
- Size delta:     width = 20.00px, height = -20.00px

Please ensure the element's position and size exactly match the container's.`);
    expect(result.pass).toBe(false);
  });
});
