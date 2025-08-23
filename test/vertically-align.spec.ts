import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';

test.describe('vertical alignment detection', () => {
  test('should detect top alignment with zero tolerance', async ({ page }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/top.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeVerticallyAlignedWith(container, 'top', 0);
  });

  test('should detect bottom alignment with zero tolerance', async ({
    page,
  }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/bottom.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeVerticallyAlignedWith(container, 'bottom', 0);
  });

  test('should detect center alignment with zero tolerance', async ({
    page,
  }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/center.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeVerticallyAlignedWith(container, 'center', 0);
  });

  test('should fail top alignment on bottom aligned element', async ({
    page,
  }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/bottom.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeVerticallyAlignedWith(container, 'top', 0);
  });

  test('should fail bottom alignment on top aligned element', async ({
    page,
  }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/top.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeVerticallyAlignedWith(container, 'bottom', 0);
  });

  test('should fail center alignment on top aligned element', async ({
    page,
  }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/top.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toBeVerticallyAlignedWith(container, 'center', 0);
  });

  test('should detect top alignment within tolerance', async ({ page }) => {
    const htmlPath = path.resolve(
      __dirname,
      'assets/vertically-align/top-offset.html',
    );
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toBeVerticallyAlignedWith(container, 'top', 5);
  });
});
