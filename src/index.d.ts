import { Locator } from '@playwright/test';
import { ToBeAlignedWithOptions } from './matchers/aligned-with';
import { ToBeFullyCenteredOptions } from './matchers/fully-centered';
import { ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
import { ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';
import { ToBeInsideOptions } from './matchers/inside';
import { ToHaveSameSizeAsOptions } from './matchers/same-size-as';

export {};

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
       * Asserts that the target element is aligned with the specified container element
       * according to the provided alignment options.
       *
       * @param container - The container element as a {@link Locator} relative to which alignment is checked.
       * @param options - Optional alignment options.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * // Checks that the button is horizontally centered with its parent within 2% tolerance
       * await expect(buttonLocator).toBeAlignedWith(parentLocator, {
       *   axis: Alignment.Horizontal,
       *   mode: AlignmentMode.Center,
       *   tolerancePercent: 2
       * });
       *
       * @example
       * // Checks that the button is aligned with its parent using default alignment options
       * await expect(buttonLocator).toBeAlignedWith(parentLocator);
       */
      toBeAlignedWith(container: Locator, options?: ToBeAlignedWithOptions): Promise<R>;

      /**
       * Asserts that the target element is fully centered both horizontally and vertically
       * within the specified container element.
       *
       * @param container - The container element as a {@link Locator} relative to which centering is checked.
       * @param options - Optional centering options.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * // Check that a modal is perfectly centered within the viewport, allowing a 2% margin
       * const parentLocator = page.locator('#parent');
       * await expect(modalLocator).toBeFullyCentered(parentLocator, {
       *   tolerancePercent: 2
       * });
       */
      toBeFullyCentered(container: Locator, options?: ToBeFullyCenteredOptions): Promise<R>;

      /**
       * Asserts that the target element is horizontally aligned with the specified container
       * according to the given alignment type.
       *
       * @param container - The container element as a {@link Locator} relative to which horizontal alignment is checked.
       * @param options - Optional alignment options.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * // Assert that a button is left-aligned with its card container, allowing 3% horizontal tolerance
       * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator, {
       *   alignment: Alignment.Left,
       *   tolerancePercent: 3
       * });
       *
       * @example
       * // Assert that a button is horizontally centered with its card container (default options)
       * await expect(buttonLocator).toBeHorizontallyAlignedWith(parentLocator);
       */
      toBeHorizontallyAlignedWith(container: Locator, options?: ToBeHorizontallyAlignedWithOptions): Promise<R>;

      /**
       * Asserts that the target element is fully contained within the specified container element,
       * allowing for an optional margin of tolerance.
       *
       * The check ensures that all sides of the target element (top, bottom, left, right)
       * are strictly within the bounds of the container, with an optional offset based on a
       * percentage of the container's dimensions.
       *
       * @param container - The container element as a {@link Locator} within which the element is expected to be fully contained.
       * @param options - Optional containment options.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * // Verify that the modal content is fully inside its container with a 2% tolerance
       * await expect(modalContentLocator).toBeInside(parentLocator, {
       *   tolerancePercent: 2
       * });
       *
       * @example
       * // Verify that the modal content is strictly inside its container without any tolerance
       * await expect(modalContentLocator).toBeInside(parentLocator);
       */
      toBeInside(container: Locator, options?: ToBeInsideOptions): Promise<R>;

      /**
       * Asserts that the target element is vertically aligned with the specified container
       * according to the given alignment type.
       *
       * @param container - The container element as a {@link Locator} relative to which vertical alignment is checked.
       * @param options - Optional size comparison options.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * // Check that a header is bottom-aligned with its section container, allowing a 2% vertical tolerance
       * await expect(headerLocator).toBeVerticallyAlignedWith(parentLocator, {
       *   alignment: 'bottom',
       *   tolerancePercent: 2
       * });
       *
       * @example
       * // Check that a header is vertically centered within its section container (default options)
       * await expect(headerLocator).toBeVerticallyAlignedWith(parentLocator);
       */
      toBeVerticallyAlignedWith(container: Locator, options?: ToBeVerticallyAlignedWithOptions): Promise<R>;

      /**
       * Asserts that the target element has the same width and height as the specified container element.
       *
       * @param container - A `Locator` representing the element to compare size with.
       * @param options - Optional configuration to customize the comparison behavior.
       * @returns A `Promise<R>` that resolves when the assertion is complete.
       *
       * @example
       * await expect(locator).toHaveSameSizeAs(parentLocator);
       */
      toHaveSameSizeAs(container: Locator, options?: ToHaveSameSizeAsOptions): Promise<R>;

      /**
       * Asserts that the target element fits entirely within the bounds of the specified container element.
       * The check ensures that all sides of the target element (top, bottom, left, right)
       * are strictly within the bounds of the container, with no partial overlap allowed.
       *
       * @param container - The container element as a {@link Locator} within which the element is expected to fit.
       * @returns A {@link Promise} that resolves with the matcher result.
       *
       * @example
       * await expect(locator).toFitContainer(parentLocator);
       */
      toFitContainer(container: Locator): Promise<R>;
    }
  }
}
