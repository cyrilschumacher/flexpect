import { expect } from '@playwright/test';

import { toBeFullyCentered } from './alignment/fully-centered';
import { toBeHorizontallyAlignedWith } from './alignment/horizontally-align-with';
import { toBeVerticallyAlignedWith } from './alignment/vertically-align-with';
import { toBeInside } from './position/inside';

expect.extend({
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
});
