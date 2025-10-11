import { expect, test } from '@playwright/test';

import { toHaveSameSizeAs } from '@flexpect';

import path from 'path';

test.describe('toHaveSameSizeAs matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toHaveSameSizeAs });
  });

  test('should detect exact same size', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/same-size-as/same-size.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toHaveSameSizeAs(container);
  });

  test('should detect different size', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/same-size-as/different-size.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toHaveSameSizeAs(container);
  });

  test('should pass when size difference is within tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/same-size-as/size-with-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerancePercent: 10 };
    await expect(element).toHaveSameSizeAs(container, options);
  });

  test('should fail when size difference exceeds tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/same-size-as/size-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { tolerancePercent: 5 };
    await expect(element).not.toHaveSameSizeAs(container, options);
  });
});
