import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';

test.describe('fully centered detection', () => {
  test('should detect vertical and horizontal center alignment with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerancePercent: 0 };
    await expect(element).toBeFullyCentered(container, options);
  });

  test('should detect vertical and horizontal center alignment within tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerancePercent: 10 };
    await expect(element).toBeFullyCentered(container, options);
  });

  test('should reject for left aligned element with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeFullyCentered(container);
  });
});
