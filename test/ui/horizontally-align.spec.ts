import { HorizontalAlignment, toBeHorizontallyAlignedWith, ToleranceUnit } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toBeHorizontallyAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeHorizontallyAlignedWith });
  });

  test.describe('when the element is center-aligned', () => {
    test('should pass when the element is centered', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center);
    });

    test('should pass when the element is centered within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center, options);
    });

    test('should pass when the element is centered within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 8, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center, options);
    });

    test('should fail when element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Center);
    });
  });

  test.describe('when the element is left-aligned', () => {
    test('should pass when the element is left-aligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left);
    });

    test('should pass when the element is left-aligned within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left, options);
    });

    test('should pass when the element is left-aligned within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left, options);
    });

    test('should fail when element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Left);
    });
  });

  test.describe('when the element is right-aligned', () => {
    test('should pass when the element is right-aligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right);
    });

    test('should pass when the element is right-aligned within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right, options);
    });

    test('should pass when the element is right-aligned within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right, options);
    });

    test('should fail when the element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/horizontally-align/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeHorizontallyAlignedWith(container, HorizontalAlignment.Right);
    });
  });
});
