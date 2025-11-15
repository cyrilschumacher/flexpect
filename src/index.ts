import { Locator } from '@playwright/test';

import { ToBeAboveOptions } from './matchers/above';
import { Alignment, Axis, ToBeAlignedWithOptions } from './matchers/aligned-with';
import { ToHaveAspectRatioOptions } from './matchers/aspect-ratio';
import { DistanceSide, ToHaveDistanceFromOptions } from './matchers/at-distance-from';
import { toBeBelowOptions } from './matchers/below';
import { ToBeFullyCenteredOptions } from './matchers/fully-centered';
import { HorizontalAlignment, ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
import { ToBeInsideOptions } from './matchers/inside';
import { ToHaveSameSizeAsOptions } from './matchers/same-size-as';
import { SpacingAxis, ToHaveSpacingBetweenOptions } from './matchers/spacing-between';
import { ToBeVerticallyAlignedWithOptions, VerticalAlignment } from './matchers/vertically-align-with';
import { ToBeWithinViewportOptions } from './matchers/within-viewport';

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
      toBeAbove(reference: Locator, options?: ToBeAboveOptions): Promise<R>;
      toBeAlignedWith(container: Locator, axis: Axis, mode: Alignment, options?: ToBeAlignedWithOptions): Promise<R>;
      toBeBelow(reference: Locator, options?: toBeBelowOptions): Promise<R>;
      toBeFullyCentered(container: Locator, options?: ToBeFullyCenteredOptions): Promise<R>;
      toBeHorizontallyAlignedWith(
        container: Locator,
        alignment: HorizontalAlignment,
        options?: ToBeHorizontallyAlignedWithOptions,
      ): Promise<R>;
      toBeInside(container: Locator, options?: ToBeInsideOptions): Promise<R>;
      toBeVerticallyAlignedWith(
        container: Locator,
        alignment: VerticalAlignment,
        options?: ToBeVerticallyAlignedWithOptions,
      ): Promise<R>;
      toBeWithinViewport(options?: ToBeWithinViewportOptions): Promise<R>;
      toFitContainer(container: Locator): Promise<R>;
      toHaveAspectRatio(expectedRatio: number, options?: ToHaveAspectRatioOptions): Promise<R>;
      toHaveColorContrast(minimumContrastRatio: number): Promise<R>;
      toHaveDistanceFrom(
        reference: Locator,
        side: DistanceSide,
        expectedDistanceInPixels: number,
        options?: ToHaveDistanceFromOptions,
      ): Promise<R>;
      toHaveSameSizeAs(container: Locator, options?: ToHaveSameSizeAsOptions): Promise<R>;
      toHaveSpacingBetween(
        reference: Locator,
        expectedSpacing: number,
        axis: SpacingAxis,
        options?: ToHaveSpacingBetweenOptions,
      ): Promise<R>;
      toNotOverlapWith(reference: Locator): Promise<R>;
    }
  }
}

export { toBeAbove } from './matchers/above';
export { Alignment, Axis, toBeAlignedWith } from './matchers/aligned-with';
export { toHaveAspectRatio } from './matchers/aspect-ratio';
export { DistanceSide, toHaveDistanceFrom } from './matchers/at-distance-from';
export { toBeBelow } from './matchers/below';
export { toHaveColorContrast } from './matchers/color-contrast';
export { toFitContainer } from './matchers/fit-container';
export { toBeFullyCentered } from './matchers/fully-centered';
export { HorizontalAlignment, toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
export { toBeInside } from './matchers/inside';
export { toNotOverlapWith } from './matchers/not-overlap-with';
export { toHaveSameSizeAs } from './matchers/same-size-as';
export { SpacingAxis, toHaveSpacingBetween } from './matchers/spacing-between';
export { ToleranceUnit } from './matchers/tolerance';
export { toBeVerticallyAlignedWith, VerticalAlignment } from './matchers/vertically-align-with';
export { toBeWithinViewport } from './matchers/within-viewport';
