import { Locator } from '@playwright/test';

import { ToBeAlignedWithOptions } from './matchers/aligned-with';
import { ToBeFullyCenteredOptions } from './matchers/fully-centered';
import { ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
import { ToBeInsideOptions } from './matchers/inside';
import { ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';

declare global {
  // Disabling the no-namespace rule to allow global type augmentation for Playwright custom matchers,
  // as module augmentation attempts resulted in persistent TypeScript errors (e.g., TS2339, TS2300).
  // This approach ensures compatibility with the current Playwright type definitions while maintaining functionality.
  // eslint-disable-next-line @typescript-eslint/no-namespace
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

export { toBeAlignedWith } from './matchers/aligned-with';
export { toFitContainer } from './matchers/fit-container';
export { toBeFullyCentered } from './matchers/fully-centered';
export { toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
export { toBeInside } from './matchers/inside';
export { toBeVerticallyAlignedWith } from './matchers/vertically-align-with';
