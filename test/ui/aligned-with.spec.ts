import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';

test.describe('alignment detection', () => {
  test.describe('Horizontal alignment detection', () => {
    test('should detect horizontal start alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'horizontal', mode: 'start', tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, options);
    });

    test('should reject horizontal start alignment if misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'horizontal', mode: 'start', tolerancePercent: 1 };
      await expect(element).not.toBeAlignedWith(container, options);
    });
  });

  test.describe('Vertical alignment detection', () => {
    test('should detect vertical end alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'vertical', mode: 'end', tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, options);
    });

    test('should reject vertical end alignment if misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'vertical', mode: 'end', tolerancePercent: 1 };
      await expect(element).not.toBeAlignedWith(container, options);
    });
  });

  test.describe('Center alignment detection', () => {
    test('should detect horizontal center alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'horizontal', mode: 'center', tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, options);
    });

    test('should detect vertical center alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { axis: 'vertical', mode: 'center', tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, options);
    });
  });
});
