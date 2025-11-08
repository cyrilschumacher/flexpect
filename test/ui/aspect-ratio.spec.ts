import { toHaveAspectRatio, ToleranceUnit } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toHaveAspectRatio matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toHaveAspectRatio });
  });

  test('should pass when element has exact 16:9 aspect ratio', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/aspect-ratio/16-9.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).toHaveAspectRatio(16 / 9);
  });

  test('should pass when element aspect ratio is within tolerance for 4:3', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/aspect-ratio/approx-4-3.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toHaveAspectRatio(4 / 3, options);
  });

  test('should pass when element has exact 1:1 (square) aspect ratio', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/aspect-ratio/square.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).toHaveAspectRatio(1);
  });

  test('should fail when element aspect ratio is outside tolerance for 4:3', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/aspect-ratio/bad-4-3.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const options = { tolerance: 2, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).not.toHaveAspectRatio(4 / 3, options);
  });
});
