import { Locator } from '@playwright/test';

type HorizontalAlignment = 'left' | 'center' | 'right';
type VerticalAlignment = 'top' | 'center' | 'bottom';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeFullyCentered(
        container: Locator,
        tolerancePercent?: number,
      ): Promise<R>;
      toBeHorizontallyAlignedWith(
        container: Locator,
        alignment?: HorizontalAlignment,
        tolerancePercent?: number,
      ): Promise<R>;
      toBeVerticallyAlignedWith(
        container: Locator,
        alignment?: VerticalAlignment,
        tolerancePercent?: number,
      ): Promise<R>;
    }
  }
}
