import { expect } from '@playwright/test';

import {
  toBeAbove,
  toBeAlignedWith,
  toBeBelow,
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
  toBeBelow,
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
