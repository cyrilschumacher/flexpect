import { describe, it, jest } from '@jest/globals';
import { Locator, Page } from '@playwright/test';
import { when } from 'jest-when';

import { toBeWithinViewport } from '@flexpect/matchers/within-viewport';
import { getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toBeWithinViewport', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  const mockPage = { viewportSize: jest.fn() } as unknown as Page;
  const mockElement = {
    page: jest.fn().mockReturnValue(mockPage),
    boundingBox: jest.fn(),
  } as unknown as Locator;

  it('should pass when element is fully within viewport (no margin)', async () => {
    const viewportSize = { width: 800, height: 600 };
    const elementBoundingBox = { x: 100, y: 100, width: 200, height: 150 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement);

    expect(result.message()).toBe('Element is fully visible within the viewport.');
    expect(result.pass).toBe(true);
  });

  it('should pass when element is fully within safe zone (with marginPixel)', async () => {
    const viewportSize = { width: 1000, height: 800 };
    const elementBoundingBox = { x: 60, y: 60, width: 300, height: 200 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement, { marginPixel: 50 });

    expect(result.message()).toBe('Element is fully visible within the viewport (with 50px margin).');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is partially outside viewport (top-left)', async () => {
    const viewportSize = { width: 800, height: 600 };
    const elementBoundingBox = { x: -50, y: -30, width: 200, height: 150 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 800×600px
- Required safe area: [0, 0] → [800.00, 600.00]
- Element bounds: x=-50, y=-30, width=200, height=150
- Overflow: left=50.00px, top=30.00px, right=0.00px, bottom=0.00px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when element is outside safe zone (with marginPixel)', async () => {
    const viewportSize = { width: 1024, height: 768 };
    const elementBoundingBox = { x: 20, y: 20, width: 300, height: 300 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement, { marginPixel: 80 });

    expect(result.message()).toEqual(`Element is not fully visible in the viewport (required 80px margin).

Details:
- Viewport size: 1024×768px
- Required safe area: [80, 80] → [944.00, 688.00]
- Element bounds: x=20, y=20, width=300, height=300
- Overflow: left=60.00px, top=60.00px, right=0.00px, bottom=0.00px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when element overflows on right and bottom', async () => {
    const viewportSize = { width: 500, height: 400 };
    const elementBoundingBox = { x: 350, y: 300, width: 200, height: 150 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 500×400px
- Required safe area: [0, 0] → [500.00, 400.00]
- Element bounds: x=350, y=300, width=200, height=150
- Overflow: left=0.00px, top=0.00px, right=50.00px, bottom=50.00px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should throw when boundingBox returns null', async () => {
    const viewportSize = { width: 800, height: 600 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(async () => {
        throw new Error('Element bounding box is null');
      });

    const resultPromise = toBeWithinViewport(mockElement);

    await expect(resultPromise).rejects.toThrow('Element bounding box is null');
  });

  it('should fail when viewport size is null', async () => {
    when(mockPage.viewportSize).calledWith().mockReturnValue(null);

    const result = await toBeWithinViewport(mockElement);

    expect(result.message()).toBe(
      'Viewport size is not available. Ensure the page is fully loaded and has a defined viewport.',
    );
    expect(result.pass).toBe(false);
  });

  it('should handle floating-point precision in overflow', async () => {
    const viewportSize = { width: 1000, height: 1000 };
    const elementBoundingBox = { x: 999.6, y: 999.6, width: 1, height: 1 };

    when(mockPage.viewportSize).calledWith().mockReturnValue(viewportSize);
    when(getBoundingBoxOrFailMock)
      .calledWith(mockElement)
      .mockImplementationOnce(() => Promise.resolve(elementBoundingBox));

    const result = await toBeWithinViewport(mockElement);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 1000×1000px
- Required safe area: [0, 0] → [1000.00, 1000.00]
- Element bounds: x=999.6, y=999.6, width=1, height=1
- Overflow: left=0.00px, top=0.00px, right=0.60px, bottom=0.60px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });
});
