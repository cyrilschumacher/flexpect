import { toBeFullyCentered, ToleranceUnit } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toBeFullyCentered matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeFullyCentered });
  });

  test('should pass vertical and horizontal center alignment', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeFullyCentered(container);
  });

  test('should pass vertical and horizontal center alignment within a percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeFullyCentered(container, options);
  });

  test('should pass vertical and horizontal center alignment within a pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerance: 25, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeFullyCentered(container, options);
  });

  test('should fail for left aligned element with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fully-centered/center-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeFullyCentered(container);
  });
});
