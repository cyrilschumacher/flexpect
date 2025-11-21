import { Locator } from '@playwright/test';

import { DistanceSide, ToHaveDistanceFromOptions } from '@flexpect/matchers/alignment/at-distance-from';
import { ToBeInsideOptions } from '@flexpect/matchers/visibility/inside';
import { ToBeWithinViewportOptions } from '@flexpect/matchers/visibility/within-viewport';
import { ToBeAboveOptions } from '@matchers/alignment/above';
import { Alignment, Axis, ToBeAlignedWithOptions } from '@matchers/alignment/aligned-with';
import { ToBeBelowOptions } from '@matchers/alignment/below';
import { ToBeFullyCenteredOptions } from '@matchers/alignment/fully-centered';
import { HorizontalAlignment, ToBeHorizontallyAlignedWithOptions } from '@matchers/alignment/horizontally-align-with';
import { ToBeLeftOfOptions } from '@matchers/alignment/left-of';
import { ToBeRightOfOptions } from '@matchers/alignment/right-of';
import { ToBeVerticallyAlignedWithOptions, VerticalAlignment } from '@matchers/alignment/vertically-align-with';
import { SpacingAxis, ToHaveSpacingBetweenOptions } from '@matchers/layout/spacing-between';
import { ToHaveAspectRatioOptions } from '@matchers/size/aspect-ratio';
import { ToHaveSameSizeAsOptions } from '@matchers/size/same-size-as';

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
      toBeBelow(reference: Locator, options?: ToBeBelowOptions): Promise<R>;
      toBeFullyCentered(container: Locator, options?: ToBeFullyCenteredOptions): Promise<R>;
      toBeHorizontallyAlignedWith(
        container: Locator,
        alignment: HorizontalAlignment,
        options?: ToBeHorizontallyAlignedWithOptions,
      ): Promise<R>;
      toBeInside(container: Locator, options?: ToBeInsideOptions): Promise<R>;
      toBeLeftOf(reference: Locator, options?: ToBeLeftOfOptions): Promise<R>;
      toBeRightOf(reference: Locator, options?: ToBeRightOfOptions): Promise<R>;
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

export { DistanceSide, toHaveDistanceFrom } from '@flexpect/matchers/alignment/at-distance-from';
export { toNotOverlapWith } from '@flexpect/matchers/layout/not-overlap-with';
export { toHaveColorContrast } from '@flexpect/matchers/visibility/color-contrast';
export { toBeInside } from '@flexpect/matchers/visibility/inside';
export { toBeWithinViewport } from '@flexpect/matchers/visibility/within-viewport';
export { ToleranceUnit } from '@helpers/tolerance';
export { toBeAbove } from '@matchers/alignment/above';
export { Alignment, Axis, toBeAlignedWith } from '@matchers/alignment/aligned-with';
export { toBeBelow } from '@matchers/alignment/below';
export { toBeFullyCentered } from '@matchers/alignment/fully-centered';
export { HorizontalAlignment, toBeHorizontallyAlignedWith } from '@matchers/alignment/horizontally-align-with';
export { toBeLeftOf } from '@matchers/alignment/left-of';
export { toBeRightOf } from '@matchers/alignment/right-of';
export { toBeVerticallyAlignedWith, VerticalAlignment } from '@matchers/alignment/vertically-align-with';
export { toFitContainer } from '@matchers/layout/fit-container';
export { SpacingAxis, toHaveSpacingBetween } from '@matchers/layout/spacing-between';
export { toHaveAspectRatio } from '@matchers/size/aspect-ratio';
export { toHaveSameSizeAs } from '@matchers/size/same-size-as';
