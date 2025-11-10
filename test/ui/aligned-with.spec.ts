import { expect, test } from '@playwright/test';
import { Alignment, Axis, toBeAlignedWith, ToleranceUnit } from '@flexpect';

import path from 'path';

test.describe('toBeAlignedWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeAlignedWith });
  });

  test.describe('when the element is aligned horizontally', () => {
    test.describe('at the start', () => {
      test('should align the element to the start', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Start);
      });

      test('should align the element to the start within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Start, options);
      });

      test('should align the element to the start within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Start, options);
      });

      test('should fail when the element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Horizontal, Alignment.Start);
      });
    });

    test.describe('at the center', () => {
      test('should align the element to the center', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Center);
      });

      test('should align the element to the center within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Center, options);
      });

      test('should align the element to the center within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.Center, options);
      });

      test('should fail when the element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Horizontal, Alignment.Center);
      });
    });

    test.describe('at the end', () => {
      test('should align the element to the end', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-end.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.End);
      });

      test('should align the element to the end within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 3, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.End, options);
      });

      test('should align the element to the end within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Horizontal, Alignment.End, options);
      });

      test('should fail when the element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/horizontal-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Horizontal, Alignment.End);
      });
    });
  });

  test.describe('when the element is aligned vertically', () => {
    test.describe('at the start', () => {
      test('should align the element to the start', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-start.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Start);
      });

      test('should align the element to the start within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 4, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Start, options);
      });

      test('should align the element to the start within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Start, options);
      });

      test('should fail when the element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-start-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Vertical, Alignment.Start);
      });
    });

    test.describe('at the center', () => {
      test('should align the element to the center', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Center);
      });

      test('should align the element to the center within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 4, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Center, options);
      });

      test('should align the element to the center within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.Center, options);
      });

      test('should fail when the element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-center-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Vertical, Alignment.Center);
      });
    });

    test.describe('at the end', () => {
      test('should align the element to the end', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.End);
      });

      test('should align the element to the end within a percentage tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 4, toleranceUnit: ToleranceUnit.Percent };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.End, options);
      });

      test('should align the element to the end within a pixel tolerance', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
        await expect(element).toBeAlignedWith(container, Axis.Vertical, Alignment.End, options);
      });

      test('should fail when element is misaligned', async ({ page }) => {
        const htmlPath = path.resolve(__dirname, 'assets/aligned-with/vertical-end-offset.html');
        await page.goto(`file://${htmlPath}`);

        const container = page.locator('#container');
        const element = page.locator('#element');
        await expect(element).not.toBeAlignedWith(container, Axis.Vertical, Alignment.End);
      });
    });
  });
});
