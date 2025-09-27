import { toFitContainer } from '@flexpect/matchers/fit-container';
import { BoundingBox, getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';
import { beforeEach, describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toFitContainer', () => {
  let getBoundingBoxOrFailMock: jest.MockedFunction<typeof getBoundingBoxOrFail>;

  beforeEach(() => {
    getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);
  });

  it('should pass when element fits exactly within container', async () => {
    const element = {} as Locator;
    const container = {} as Locator;
    const box = { x: 10, y: 20, width: 100, height: 200 } as BoundingBox;

    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(box);
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(box);

    const result = await toFitContainer(element, container);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Element fits exactly within container.');
  });

  it('should fail when element position differs', async () => {
    const element = {} as Locator;
    const elementBox = { x: 15, y: 25, width: 100, height: 200 };
    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 };

    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Position delta: x=5.00px, y=5.00px');
    expect(result.message()).toContain('Size delta: width=0.00px, height=0.00px');
  });

  it('should fail when element size differs', async () => {
    const element = {} as Locator;
    const elementBox = { x: 10, y: 20, width: 110, height: 190 };
    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 };

    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Position delta: x=0.00px, y=0.00px');
    expect(result.message()).toContain('Size delta: width=10.00px, height=-10.00px');
  });

  it('should fail when both position and size differ', async () => {
    const element = {} as Locator;
    const elementBox = { x: 12, y: 18, width: 120, height: 180 };
    const container = {} as Locator;
    const containerBox = { x: 10, y: 20, width: 100, height: 200 };

    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBox);
    when(getBoundingBoxOrFailMock).calledWith(container).mockResolvedValueOnce(containerBox);

    const result = await toFitContainer(element, container);

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Position delta: x=2.00px, y=-2.00px');
    expect(result.message()).toContain('Size delta: width=20.00px, height=-20.00px');
  });
});
