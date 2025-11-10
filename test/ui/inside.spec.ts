import { toBeInside, ToleranceUnit } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toBeInside matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeInside });
  });

  test('should pass when element is fully inside container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/inside/inside.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeInside(container);
  });

  test('should pass when element is fully inside container within a percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/inside/inside-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeInside(container, options);
  });

  test('should pass when element is fully inside container within a pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/inside/inside-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeInside(container, options);
  });

  test('should fail when element is partially outside container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/inside/outside.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeInside(container);
  });
});
