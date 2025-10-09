import { expect, Locator } from '@playwright/test';

import { toBeAlignedWith, ToBeAlignedWithOptions } from './matchers/aligned-with';
import { toFitContainer } from './matchers/fit-container';
import { toBeFullyCentered, ToBeFullyCenteredOptions } from './matchers/fully-centered';
import { toBeHorizontallyAlignedWith, ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
import { toBeInside, ToBeInsideOptions } from './matchers/inside';
import { toBeVerticallyAlignedWith, ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';

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
      toBeAlignedWith(container: Locator, options?: ToBeAlignedWithOptions): Promise<R>;
      toBeFullyCentered(container: Locator, options?: ToBeFullyCenteredOptions): Promise<R>;
      toBeHorizontallyAlignedWith(container: Locator, options?: ToBeHorizontallyAlignedWithOptions): Promise<R>;
      toBeInside(container: Locator, options?: ToBeInsideOptions): Promise<R>;
      toBeVerticallyAlignedWith(container: Locator, options?: ToBeVerticallyAlignedWithOptions): Promise<R>;
      toFitContainer(container: Locator): Promise<R>;
    }
  }
}


expect.extend({
  toBeAlignedWith,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toFitContainer,
});
