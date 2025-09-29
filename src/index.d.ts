import { Locator } from '@playwright/test';

type HorizontalAlignment = 'left' | 'center' | 'right';
type VerticalAlignment = 'top' | 'center' | 'bottom';

declare global {
  namespace PlaywrightTest {
    /**
     * Provides a set of assertion matchers for verifying the spatial relationship and alignment
     * of a target element relative to a specified container element. These matchers enable
     * comprehensive checks for centering, alignment (horizontal and vertical), containment,
     * and fitting within containers, with configurable tolerance levels.
     *
     * The interface is designed to facilitate robust UI testing by allowing precise validation
     * of element positioning and layout constraints, supporting both strict and margin-based assertions.
     *
     * Each matcher returns a Promise that resolves with the result of the assertion, enabling
     * asynchronous test flows and integration with modern testing frameworks.
     *
     * @template R The result type returned by each matcher, typically a Promise resolving to an assertion result.
     */
    interface Matchers<R> {
      /**
       * Asserts that the target element is fully centered both horizontally and vertically
       * within the specified container element.
       *
       * @param container - The container element as a {@link Locator} relative to which centering is checked.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's width and height.
       *                           Defaults to 5% if not provided. The tolerance applies to both dimensions.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeFullyCentered(container: Locator, tolerancePercent?: number): Promise<R>;

      /**
       * Asserts that the target element is horizontally aligned with the specified container
       * according to the given alignment type.
       *
       * Alignment types:
       * - 'left': The left edges of the target and container are equal within the tolerance.
       * - 'center': The horizontal centers of the target and container are equal within the tolerance.
       * - 'right': The right edges of the target and container are equal within the tolerance.
       *
       * If the `alignment` parameter is omitted, it defaults to `'center'`.
       *
       * @param container - The container element as a {@link Locator} relative to which horizontal alignment is checked.
       * @param alignment - Optional alignment type ('left', 'center', 'right').
       *                    Defaults to 'center' if not provided.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's width.
       *                           Defaults to 5% if not provided.
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
       * @param container - The container element as a {@link Locator} within which the element is expected to be fully contained.
       * @param tolerancePercent - Optional. A percentage of the container's width and height to allow as a margin
       *                           of tolerance. Defaults to 5% if not provided.
       *
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeInside(container: Locator, tolerancePercent?: number): Promise<R>;

      /**
       * Asserts that the target element is vertically aligned with the specified container
       * according to the given alignment type.
       *
       * Alignment types:
       * - 'top': The top edges of the target and container are equal within the tolerance.
       * - 'center': The vertical centers of the target and container are equal within the tolerance.
       * - 'bottom': The bottom edges of the target and container are equal within the tolerance.
       *
       * If the `alignment` parameter is omitted, it defaults to `'center'`.
       * If the container is not present, the assertion will fail and return an error indicating the container could not be found.
       *
       * @param container - The container element as a {@link Locator} relative to which vertical alignment is checked.
       * @param alignment - Optional alignment type ('top', 'center', 'bottom'). Defaults to 'center' if not provided.
       * @param tolerancePercent - Optional tolerance allowed as a percentage of the container's height.
       *                           Defaults to 5% if not provided.
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
