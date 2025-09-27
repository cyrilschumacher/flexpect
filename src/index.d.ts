import { Locator } from '@playwright/test';

type HorizontalAlignment = 'left' | 'center' | 'right';
type VerticalAlignment = 'top' | 'center' | 'bottom';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the target element is fully centered both horizontally and vertically
       * within the specified container element.
       *
       * @param container - The container Locator relative to which centering is checked.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's size.
       *                           Defaults to 5 if not provided.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeFullyCentered(container: Locator, tolerancePercent?: number): Promise<R>;

      /**
       * Asserts that the target element is horizontally aligned with the specified container
       * according to the given alignment type.
       *
       * @param container - The container Locator relative to which horizontal alignment is checked.
       * @param alignment - Optional alignment type (e.g., 'left', 'center', 'right').
       *                    Defaults to 'center' if not provided.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's width.
       *                           Defaults to 5 if not provided.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeHorizontallyAlignedWith(
        container: Locator,
        alignment?: HorizontalAlignment,
        tolerancePercent?: number,
      ): Promise<R>;

      /**
       * Asserts that the target element is fully contained within the specified container element,
       * allowing for an optional margin of tolerance.
       *
       * The check ensures that all sides of the target element (top, bottom, left, right)
       * are strictly within the bounds of the container, with an optional offset based on a
       * percentage of the container's dimensions.
       *
       * @param container - The container {@link Locator} within which the element is expected to be fully contained.
       * @param tolerancePercent - Optional. A percentage of the container’s width and height to allow as a margin
       *                           of tolerance. Defaults to 5%.
       *
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeInside(container: Locator, tolerancePercent?: number): Promise<R>;

      /**
       * Asserts that the target element is vertically aligned with the specified container
       * according to the given alignment type.
       *
       * @param container - The container Locator relative to which vertical alignment is checked.
       * @param alignment - Optional alignment type (e.g., 'top', 'center', 'bottom').
       *                    Defaults to 'center' if not provided.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's height.
       *                           Defaults to 5 if not provided.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeVerticallyAlignedWith(
        container: Locator,
        alignment?: VerticalAlignment,
        tolerancePercent?: number,
      ): Promise<R>;

      /**
       * Asserts that the target element fits entirely within the bounds of the specified container element.
       * The check ensures that all sides of the target element (top, bottom, left, right)
       * are strictly within the bounds of the container, with no partial overlap allowed.
       *
       * @param container - The container element as a {@link Locator} within which the element is expected to fit.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toFitContainer(container: Locator): Promise<R>;
    }
  }
}
