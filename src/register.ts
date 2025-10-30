import { expect } from '@playwright/test';

import {
  toBeAlignedWith,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toFitContainer,
  toHaveAspectRatio,
  toHaveColorContrast,
  toHaveSameSizeAs,
  toNotOverlapWith,
} from '.';

expect.extend({
  toBeAlignedWith,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toFitContainer,
  toHaveAspectRatio,
  toHaveColorContrast,
  toHaveSameSizeAs,
  toNotOverlapWith,
});
