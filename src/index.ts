import { expect } from '@playwright/test';

import { toBeAlignedWith } from './matchers/aligned-with';
import { toFitContainer } from './matchers/fit-container';
import { toBeFullyCentered } from './matchers/fully-centered';
import { toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
import { toBeInside } from './matchers/inside';
import { toBeVerticallyAlignedWith } from './matchers/vertically-align-with';

export { Alignment, type ToBeAlignedWithOptions } from './matchers/aligned-with';
export type { ToBeFullyCenteredOptions } from './matchers/fully-centered';
export { HorizontalAlignment, type ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
export type { ToBeInsideOptions } from './matchers/inside';
export { VerticalAlignment, type ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';

expect.extend({
  toBeAlignedWith,
  toFitContainer,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
});
