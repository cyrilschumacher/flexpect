import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';
import { VerticalAlignment } from '@flexpect';

test.describe('vertical alignment detection', () => {
  test('should detect top alignment with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Top, tolerancePercent: 0 };
    await expect(element).toBeVerticallyAlignedWith(container, options);
  });

  test('should detect bottom alignment with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Bottom, tolerancePercent: 0 };
    await expect(element).toBeVerticallyAlignedWith(container, options);
  });

  test('should detect center alignment with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Center, tolerancePercent: 0 };
    await expect(element).toBeVerticallyAlignedWith(container, options);
  });

  test('should fail top alignment on bottom aligned element', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Top, tolerancePercent: 0 };
    await expect(element).not.toBeVerticallyAlignedWith(container, options);
  });

  test('should fail bottom alignment on top aligned element', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Bottom, tolerancePercent: 0 };
    await expect(element).not.toBeVerticallyAlignedWith(container, options);
  });

  test('should fail center alignment on top aligned element', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Center, tolerancePercent: 0 };
    await expect(element).not.toBeVerticallyAlignedWith(container, options);
  });

  test('should detect top alignment within tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top-offset.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    const options = { alignment: VerticalAlignment.Top, tolerancePercent: 5 };
    await expect(element).toBeVerticallyAlignedWith(container, options);
  });
});
