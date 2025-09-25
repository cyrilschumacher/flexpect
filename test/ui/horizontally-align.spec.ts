import { expect, test } from '@playwright/test';

import path from 'path';

import '@flexpect';

test.describe('horizontal alignment detection', () => {
  test.describe('center alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/center.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'center', 0);
    });

    test('should detect within tolerance using offset file', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/center-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'center', 3);
    });

    test('should reject for left aligned element with zero tolerance', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/center-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(
        container,
        'center',
        0,
      );
    });
  });

  test.describe('left alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/left.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'left', 0);
    });

    test('should detect within tolerance using right offset file', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/left-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'left', 5);
    });

    test('should reject for right aligned element with zero tolerance', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/left-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(
        container,
        'left',
        0,
      );
    });
  });

  test.describe('right alignment', () => {
    test('should detect with zero tolerance', async ({ page }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/right.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'right', 0);
    });

    test('should detect within tolerance using left offset file', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/right-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, 'right', 5);
    });

    test('should reject for left aligned element with zero tolerance', async ({
      page,
    }) => {
      const htmlPath = path.resolve(
        __dirname,
        'assets/horizontally-align/right-offset.html',
      );
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(
        container,
        'right',
        0,
      );
    });
  });
});
