import { expect } from '@playwright/test';

import { toBeFullyCentered } from './matchers/fully-centered';
import { toBeHorizontallyAlignedWith } from './matchers/horizontally-align-with';
import { toBeInside } from './matchers/inside';
import { toBeVerticallyAlignedWith } from './matchers/vertically-align-with';

expect.extend({
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
});
