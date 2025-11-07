import { toHaveColorContrast } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toHaveColorContrast matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toHaveColorContrast });
  });

  test('should pass when element has sufficient color contrast', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/color-contrast/high-contrast.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const minimumContrast = 4.5;
    await expect(element).toHaveColorContrast(minimumContrast);
  });

  test('should pass when element has exact color contrast at minimum threshold', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/color-contrast/medium-contrast.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).toHaveColorContrast(4.5);
  });

  test('should fail when element has medium color contrast but out of tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/color-contrast/medium-contrast.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).not.toHaveColorContrast(5.5);
  });

  test('should fail when element has insufficient color contrast', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/color-contrast/low-contrast.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).not.toHaveColorContrast(4.5);
  });
});
