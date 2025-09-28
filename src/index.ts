import { expect } from '@playwright/test';

import { toFitContainer } from './matchers/fit-container';
import { toBeFullyCentered } from './matchers/fully-centered';
import { toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
import { toBeInside } from './matchers/inside';
import { toBeVerticallyAlignedWith } from './matchers/vertically-align-with';

export { HorizontalAlignment } from './matchers/horizontally-align-with';
export { VerticalAlignment } from './matchers/vertically-align-with';

export type { ToBeFullyCenteredOptions } from './matchers/fully-centered';
export type { ToBeHorizontallyAlignedWithOptions } from './matchers/horizontally-align-with';
export type { ToBeInsideOptions } from './matchers/inside';
export type { ToBeVerticallyAlignedWithOptions } from './matchers/vertically-align-with';

expect.extend({
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toFitContainer,
});
