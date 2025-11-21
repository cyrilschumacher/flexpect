import { Locator, MatcherReturnType } from '@playwright/test';
import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';

/**
 * Options for the {@link toBeWithinViewport} matcher.
 */
export interface ToBeWithinViewportOptions {
  /**
   * Margin in pixels to apply around the viewport edges.
   *
   * This creates a "safe zone" inside the viewport. The element must be fully contained
   * within this inner rectangle to pass the assertion.
   *
   * Useful for:
   * - Avoiding sticky headers/footers
   * - Accounting for floating action buttons
   * - Ensuring visibility in scrollable containers with padding
   *
   * @default 0
   */
  marginPixel?: number;
}

/**
 * Asserts that the element is **fully visible within the current viewport**, optionally
 * respecting a safety margin from the viewport edges.
 *
 * ```text
 * ┌────────────────────────────────────┐
 * │             Viewport               │
 * │                                    │
 * │  ┌──marginPixel──┐                 │
 * │  │               │                 │
 * │  │   [element]   │ ← must be here  │
 * │  │               │                 │
 * │  └───────────────┘                 │
 * └────────────────────────────────────┘
 * ```
 *
 * @param element - The {@link Locator} of the element to check.
 * @param options - Optional configuration for margin.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Element must be fully in viewport (no margin)
 * await expect(card).toBeWithinViewport();
 *
 * @example
 * // Element must be fully visible with 50px margin from all edges
 * await expect(modal).toBeWithinViewport({ marginPixel: 50 });
 */
export async function toBeWithinViewport(
  element: Locator,
  options: ToBeWithinViewportOptions = {},
): Promise<MatcherReturnType> {
  const { marginPixel = 0 } = options;
  if (marginPixel < 0) {
    throw new Error('marginPixel must be greater than or equal to 0');
  }

  const page = element.page();
  const viewportSize = page.viewportSize();
  if (!viewportSize) {
    return {
      pass: false,
      message: () => 'Viewport size is not available. Ensure the page is fully loaded and has a defined viewport.',
    };
  }

  const elementBox = await getBoundingBoxOrFail(element);

  const { x, y, width, height } = elementBox;
  const { width: viewportWidth, height: viewportHeight } = viewportSize;

  const rightBound = viewportWidth - marginPixel;
  const bottomBound = viewportHeight - marginPixel;
  if (x >= marginPixel && y >= marginPixel && x + width <= rightBound && y + height <= bottomBound) {
    return {
      pass: true,
      message: () =>
        marginPixel
          ? `Element is fully visible in the viewport, including a ${marginPixel}px margin.`
          : 'Element is fully visible in the viewport.',
    };
  }

  return {
    pass: false,
    message: () => {
      const overflowLeft = Math.max(0, marginPixel - x);
      const overflowTop = Math.max(0, marginPixel - y);
      const overflowRight = Math.max(0, x + width - rightBound);
      const overflowBottom = Math.max(0, y + height - bottomBound);

      return `Element is not fully visible in the viewport${marginPixel > 0 ? ` (required ${marginPixel}px margin)` : ''}.

Details:
- Viewport size: ${viewportWidth}×${viewportHeight}px
- Required safe area: [${marginPixel}, ${marginPixel}] → [${rightBound.toFixed(2)}, ${bottomBound.toFixed(2)}]
- Element bounds: x=${x}, y=${y}, width=${width}, height=${height}
- Overflow: left=${overflowLeft.toFixed(2)}px, top=${overflowTop.toFixed(2)}px, right=${overflowRight.toFixed(2)}px, bottom=${overflowBottom.toFixed(2)}px

Scroll the page or adjust layout to bring the element fully into view.`;
    },
  };
}
