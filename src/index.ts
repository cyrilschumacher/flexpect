import { expect } from '@playwright/test';
import { toBeHorizontallyAlignedWith } from './alignment/horizontally-align-with';
import { toBeVerticallyAlignedWith } from './alignment/vertically-align-with';

expect.extend({
  toBeHorizontallyAlignedWith,
  toBeVerticallyAlignedWith,
});
