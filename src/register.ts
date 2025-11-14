import { expect } from '@playwright/test';

import {
  toBeAlignedWith,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toBeWithinViewport,
  toFitContainer,
  toHaveAspectRatio,
  toHaveColorContrast,
  toHaveDistanceFrom,
  toHaveSameSizeAs,
  toHaveSpacingBetween,
  toNotOverlapWith,
} from '.';

expect.extend({
  toBeAlignedWith,
  toBeFullyCentered,
  toBeHorizontallyAlignedWith,
  toBeInside,
  toBeVerticallyAlignedWith,
  toBeWithinViewport,
  toFitContainer,
  toHaveAspectRatio,
  toHaveColorContrast,
  toHaveDistanceFrom,
  toHaveSameSizeAs,
  toHaveSpacingBetween,
  toNotOverlapWith,
});
