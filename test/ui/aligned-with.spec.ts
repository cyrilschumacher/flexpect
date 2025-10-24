import { Alignment, Axis } from '@flexpect/matchers/aligned-with';
import { expect, test } from '@playwright/test';

import { toBeAlignedWith } from '@flexpect';

import path from 'path';

test.describe('toBeAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeAlignedWith });
  });

  test.describe('Horizontal alignment', () => {
    test('should pass horizontal start alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Start, options);
    });

    test('should fail horizontal start alignment if misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).not.toBeAlignedWith(container, Axis.Horizontal, Alignment.Start, options);
    });
  });

  test.describe('Vertical alignment', () => {
    test('should pass vertical end alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.End, options);
    });

    test('should fail vertical end alignment if misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).not.toBeAlignedWith(container, Axis.Vertical, Alignment.End, options);
    });
  });

  test.describe('Center alignment', () => {
    test('should pass horizontal center alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Center, options);
    });

    test('should pass vertical center alignment', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerancePercent: 1 };
      await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Center, options);
    });
  });
});
