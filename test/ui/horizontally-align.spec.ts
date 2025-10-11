import { expect, test } from '@playwright/test';

import { toBeHorizontallyAlignedWith } from '@flexpect';
import { HorizontalAlignment } from '@flexpect/matchers/horizontally-align-with';

import path from 'path';

test.describe('toBeHorizontallyAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeHorizontallyAlignedWith });
  });

  test.describe('Center alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center, options);
    });

    test('should detect within tolerance using offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 3 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center, options);
    });

    test('should reject for left aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center, options);
    });
  });

  test.describe('Left alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left, options);
    });

    test('should detect within tolerance using right offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 5 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left, options);
    });

    test('should reject for right aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left, options);
    });
  });

  test.describe('Right alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right, options);
    });

    test('should detect within tolerance using left offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 5 };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right, options);
    });

    test('should reject for left aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right, options);
    });
  });
});
