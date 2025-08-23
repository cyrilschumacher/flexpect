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
    }
  }
}
