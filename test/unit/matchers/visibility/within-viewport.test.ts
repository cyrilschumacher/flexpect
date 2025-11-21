import { describe, it, jest } from '@jest/globals';
import { Locator, Page } from '@playwright/test';
import { when } from 'jest-when';

import { toBeWithinViewport } from '@flexpect/matchers/visibility/within-viewport';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toBeWithinViewport', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when element is fully within viewport', async () => {
    const viewportSize = { width: 800, height: 600 };
    const mockViewportSize = jest.fn(() => viewportSize);

    const page = { viewportSize: mockViewportSize };
    const mockPage = jest.fn(() => page);

    const element = { page: mockPage } as unknown as Locator;
    const elementBoundingBox = { x: 100, y: 100, width: 200, height: 150 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const result = await toBeWithinViewport(element);

    expect(result.message()).toBe('Element is fully visible in the viewport.');
    expect(result.pass).toBe(true);
  });

  it('should fail when element is partially outside viewport (top-left)', async () => {
    const viewportSize = { width: 800, height: 600 };
    const mockViewportSize = jest.fn(() => viewportSize);

    const page = { viewportSize: mockViewportSize } as unknown as Page;
    const mockPage = jest.fn(() => page);

    const element = { page: mockPage } as unknown as Locator;
    const elementBoundingBox = { x: -50, y: -30, width: 200, height: 150 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const result = await toBeWithinViewport(element);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 800×600px
- Required safe area: [0, 0] → [800.00, 600.00]
- Element bounds: x=-50, y=-30, width=200, height=150
- Overflow: left=50.00px, top=30.00px, right=0.00px, bottom=0.00px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when element overflows on right and bottom', async () => {
    const viewportSize = { width: 500, height: 400 };
    const mockViewportSize = jest.fn(() => viewportSize);

    const page = { viewportSize: mockViewportSize } as unknown as Page;
    const mockPage = jest.fn(() => page);

    const element = { page: mockPage } as unknown as Locator;
    const elementBoundingBox = { x: 350, y: 300, width: 200, height: 150 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const result = await toBeWithinViewport(element);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 500×400px
- Required safe area: [0, 0] → [500.00, 400.00]
- Element bounds: x=350, y=300, width=200, height=150
- Overflow: left=0.00px, top=0.00px, right=50.00px, bottom=50.00px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when viewport size is null', async () => {
    const mockViewportSize = jest.fn(() => null);

    const page = { viewportSize: mockViewportSize } as unknown as Page;
    const mockPage = jest.fn(() => page);

    const element = { page: mockPage } as unknown as Locator;

    const result = await toBeWithinViewport(element);

    expect(result.message()).toBe(
      'Viewport size is not available. Ensure the page is fully loaded and has a defined viewport.',
    );
    expect(result.pass).toBe(false);
  });

  it('should handle floating-point precision in overflow', async () => {
    const viewportSize = { width: 1000, height: 1000 };
    const mockViewportSize = jest.fn(() => viewportSize);

    const page = { viewportSize: mockViewportSize } as unknown as Page;
    const mockPage = jest.fn(() => page);

    const element = { page: mockPage } as unknown as Locator;
    const elementBoundingBox = { x: 999.6, y: 999.6, width: 1, height: 1 } as never;
    when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

    const result = await toBeWithinViewport(element);

    expect(result.message()).toEqual(`Element is not fully visible in the viewport.

Details:
- Viewport size: 1000×1000px
- Required safe area: [0, 0] → [1000.00, 1000.00]
- Element bounds: x=999.6, y=999.6, width=1, height=1
- Overflow: left=0.00px, top=0.00px, right=0.60px, bottom=0.60px

Scroll the page or adjust layout to bring the element fully into view.`);
    expect(result.pass).toBe(false);
  });

  it('should throw an error for invalid margin in pixels', async () => {
    const element = {} as Locator;
    const options = { marginPixel: -10 };

    await expect(toBeWithinViewport(element, options)).rejects.toThrow(
      'marginPixel must be greater than or equal to 0',
    );
  });

  describe('with margin', () => {
    it('should pass when element is fully within safe zone', async () => {
      const viewportSize = { width: 1000, height: 800 };
      const mockViewportSize = jest.fn(() => viewportSize);

      const page = { viewportSize: mockViewportSize } as unknown as Page;
      const mockPage = jest.fn(() => page);

      const element = { page: mockPage } as unknown as Locator;
      const elementBoundingBox = { x: 60, y: 60, width: 300, height: 200 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const options = { marginPixel: 50 };
      const result = await toBeWithinViewport(element, options);

      expect(result.message()).toBe('Element is fully visible in the viewport, including a 50px margin.');
      expect(result.pass).toBe(true);
    });

    it('should fail when element is outside safe zone', async () => {
      const viewportSize = { width: 1024, height: 768 };
      const mockViewportSize = jest.fn(() => viewportSize);

      const page = { viewportSize: mockViewportSize } as unknown as Page;
      const mockPage = jest.fn(() => page);

      const element = { page: mockPage } as unknown as Locator;
      const elementBoundingBox = { x: 20, y: 20, width: 300, height: 300 } as never;
      when(getBoundingBoxOrFailMock).calledWith(element).mockResolvedValueOnce(elementBoundingBox);

      const options = { marginPixel: 80 };
      const result = await toBeWithinViewport(element, options);

      expect(result.message()).toEqual(`Element is not fully visible in the viewport (required 80px margin).

Details:
- Viewport size: 1024×768px
- Required safe area: [80, 80] → [944.00, 688.00]
- Element bounds: x=20, y=20, width=300, height=300
- Overflow: left=60.00px, top=60.00px, right=0.00px, bottom=0.00px

Scroll the page or adjust layout to bring the element fully into view.`);
      expect(result.pass).toBe(false);
    });
  });
});
