import { expect, test } from '@playwright/test';
import { HorizontalAlignment } from '@flexpect/index';

import path from 'path';

import '@flexpect';

test.describe('horizontal alignment detection', () => {
  test.describe('center alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should detect within tolerance using offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 3 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should reject for left aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Center, tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, options);
    });
  });

  test.describe('left alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Left, tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should detect within tolerance using right offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Left, tolerancePercent: 5 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should reject for right aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Left, tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, options);
    });
  });

  test.describe('right alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Right, tolerancePercent: 0 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should detect within tolerance using left offset file', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Right, tolerancePercent: 5 };
      await expect(element).toBeHorizontallyAlignedWith(container, options);
    });

    test('should reject for left aligned element with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { alignment: HorizontalAlignment.Right, tolerancePercent: 0 };
      await expect(element).not.toBeHorizontallyAlignedWith(container, options);
    });
  });
});
