import { toBeVerticallyAlignedWith, VerticalAlignment } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toBeVerticallyAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeVerticallyAlignedWith });
  });

  test.describe('Top alignment', () => {
    test('should pass when element is top aligned with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Top, options);
    });

    test('should fail when element is bottom aligned instead of top', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Top, options);
    });

    test('should pass when element is top aligned within tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 5 };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Top, options);
    });
  });

  test.describe('Bottom alignment', () => {
    test('should pass when element is bottom aligned with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom, options);
    });

    test('should fail when element is top aligned instead of bottom', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: VerticalAlignment.Bottom, tolerancePercent: 0 };
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom, options);
    });
  });

  test.describe('Center alignment', () => {
    test('should pass when element is center aligned with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: VerticalAlignment.Center, tolerancePercent: 0 };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Center, options);
    });

    test('should fail when element is top aligned instead of center', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: VerticalAlignment.Center, tolerancePercent: 0 };
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Center, options);
    });
  });
});
