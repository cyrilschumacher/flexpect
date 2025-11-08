import { expect, test } from '@playwright/test';
import { toBeWithinViewport } from '@flexpect';

import path from 'path';

test.describe('toBeWithinViewport matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeWithinViewport });
  });

  test('should pass when element is fully inside viewport', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/fully-visible.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).toBeWithinViewport();
  });

  test('should fail when element is partially outside viewport', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/partially-outside.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).not.toBeWithinViewport();
  });

  test('should fail when element is completely outside viewport', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/completely-outside.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    await expect(element).not.toBeWithinViewport();
  });

  test('should pass when element is fully inside safe zone with margin', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/visible-with-margin.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const options = { marginPixel: 50 };
    await expect(element).toBeWithinViewport(options);
  });

  test('should fail when element is inside viewport but outside safe margin', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/visible-but-near-edge.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const options = { marginPixel: 100 };
    await expect(element).not.toBeWithinViewport(options);
  });

  test('should fail when element overlaps margin boundary', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/within-viewport/overlaps-margin.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const options = { marginPixel: 80 };
    await expect(element).not.toBeWithinViewport(options);
  });

  test('should fail if viewport is not defined', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 0, height: 0 } });

    try {
      const page = await context.newPage();

      const htmlPath = path.resolve(__dirname, 'assets/within-viewport/fully-visible.html');
      await page.goto(`file://${htmlPath}`);

      const element = page.locator('#element');
      await expect(element).not.toBeWithinViewport();
    } finally {
      await context.close();
    }
  });
});
