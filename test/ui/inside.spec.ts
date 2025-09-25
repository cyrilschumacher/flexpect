import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';

test.describe('inside detection', () => {
    test('should detect when element is fully inside container with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/inside/inside.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeInside(container, 0);
    });

    test('should detect when element is fully inside container within tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/inside/inside-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeInside(container, 5);
    });

    test('should reject when element is partially outside container with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/inside/outside.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeInside(container);
    });
});
