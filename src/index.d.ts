import { Locator } from '@playwright/test';
import { ToBeFullyCenteredOptions } from './matchers/fully-centered';
import { ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
import { ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';
import { ToBeInsideOptions } from './matchers/inside';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the target element is fully centered both horizontally and vertically
       * within the specified container element.
       *
       * @param container - The container element as a {@link Locator} relative to which centering is checked.
       * @param options - Optional centering options. See {@link ToBeFullyCenteredOptions} for available properties,
       *                  such as `tolerancePercent` (defaults to 0% if not provided).
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeFullyCentered(container: Locator, options?: ToBeFullyCenteredOptions): Promise<R>;

      /**
       * Asserts that the target element is horizontally aligned with the specified container
       * according to the given alignment type.
       *
       * Alignment types:
       * - 'left': The left edges of the target and container are equal within the tolerance.
       * - 'center': The horizontal centers of the target and container are equal within the tolerance.
       * - 'right': The right edges of the target and container are equal within the tolerance.
       *
       * The `options` object may include:
       * - `alignment`: Optional alignment type ('left', 'center', 'right'). Defaults to 'center' if not provided.
       * - `tolerancePercent`: Optional tolerance allowed as a percentage of the container's width. Defaults to 5% if not provided.
       *
       * @param container - The container element as a {@link Locator} relative to which horizontal alignment is checked.
       * @param options - Optional object containing alignment and tolerance properties.
       * @returns A {@link Promise} that resolves with the matcher result.
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
       * The `options` object may include:
       * - `tolerancePercent`: Optional tolerance allowed as a percentage of the container's width and height. Defaults to 0% if not provided.
       *
       * @param container - The container element as a {@link Locator} within which the element is expected to be fully contained.
       * @param options - Optional object containing tolerance properties.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeInside(container: Locator, options?: ToBeInsideOptions): Promise<R>;

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
       * @param options - Optional object containing alignment and tolerance properties:
       *                  - `alignment`: Optional alignment type ('top', 'center', 'bottom'). Defaults to 'center' if not provided.
       *                  - `tolerancePercent`: Optional tolerance allowed as a percentage of the container's height. Defaults to 0% if not provided.
       * @returns A {@link Promise} that resolves with the matcher result.
       */
      toBeVerticallyAlignedWith(container: Locator, options?: ToBeVerticallyAlignedWithOptions): Promise<R>;

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
