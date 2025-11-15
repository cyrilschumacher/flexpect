import { expect } from '@playwright/test';

import {
  toBeAbove,
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
  toBeAbove,
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
