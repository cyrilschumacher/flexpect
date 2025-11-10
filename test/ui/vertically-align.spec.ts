import { toBeVerticallyAlignedWith, ToleranceUnit, VerticalAlignment } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toBeVerticallyAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeVerticallyAlignedWith });
  });

  test.describe('when the element is bottom-aligned', () => {
    test('should pass when the element is centered', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom);
    });

    test('should pass when the element is centered within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom, options);
    });

    test('should pass when the element is centered within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom, options);
    });

    test('should fail when element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Bottom);
    });
  });

  test.describe('when the element is center-aligned', () => {
    test('should pass when the element is center-aligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Center);
    });

    test('should pass when the element is center-aligned within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Center, options);
    });

    test('should pass when the element is center-aligned within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Center, options);
    });

    test('should fail when element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/center-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Center);
    });
  });

  test.describe('when the element is top-aligned', () => {
    test('should pass when the element is top-aligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Top);
    });

    test('should pass when the element is top-aligned within a percentage tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Top, options);
    });

    test('should pass when the element is top-aligned within a pixel tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      const options = { tolerance: 20, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toBeVerticallyAlignedWith(container, VerticalAlignment.Top, options);
    });

    test('should fail when the element is misaligned', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/vertically-align/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const container = page.locator('#container');
      const element = page.locator('#element');
      await expect(element).not.toBeVerticallyAlignedWith(container, VerticalAlignment.Top);
    });
  });
});
