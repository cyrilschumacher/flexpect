import { expect } from '@playwright/test';

import {
  toBeAlignedWith,
  toHaveAspectRatio,
  toFitContainer,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toHaveSameSizeAs,
  toNotOverlapWith,
  toBeVerticallyAlignedWith,
} from '.';

expect.extend({
  toBeAlignedWith,
  toHaveAspectRatio,
  toFitContainer,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toHaveSameSizeAs,
  toNotOverlapWith,
  toBeVerticallyAlignedWith,
});
