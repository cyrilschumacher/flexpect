import { expect } from '@playwright/test';

import { toFitContainer } from './matchers/fit-container';
import { toBeFullyCentered } from './matchers/fully-centered';
import { toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
import { toBeInside } from './matchers/inside';
import { toBeVerticallyAlignedWith } from './matchers/vertically-align-with';

expect.extend({
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toFitContainer,
});
