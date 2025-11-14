import { expect, test } from '@playwright/test';
import { toHaveDistanceFrom, DistanceSide, ToleranceUnit } from '@flexpect';
import path from 'path';

test.describe('toHaveDistanceFrom matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toHaveDistanceFrom });
  });

  test.describe('when measuring distance from top edge', () => {
    test('should have exact distance of 100px from top edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/top-exact.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Top, 100);
    });

    test('should have distance within 10px tolerance from top edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Top, 100, options);
    });

    test('should have distance within 10% tolerance from top edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Top, 100, options);
    });

    test('should fail when distance is outside tolerance from top edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/top-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).not.toHaveDistanceFrom(reference, DistanceSide.Top, 100);
    });
  });

  test.describe('when measuring distance from right edge', () => {
    test('should have exact distance of 100px from right edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/right-exact.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Right, 100);
    });

    test('should have distance within 10px tolerance from right edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Right, 100, options);
    });

    test('should have distance within 10% tolerance from right edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Right, 100, options);
    });

    test('should fail when distance is outside tolerance from right edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/right-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).not.toHaveDistanceFrom(reference, DistanceSide.Right, 100);
    });
  });

  test.describe('when measuring distance from bottom edge', () => {
    test('should have exact distance of 100px from bottom edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/bottom-exact.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Bottom, 100);
    });

    test('should have distance within 10px tolerance from bottom edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Bottom, 100, options);
    });

    test('should have distance within 10% tolerance from bottom edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Bottom, 100, options);
    });

    test('should fail when distance is outside tolerance from bottom edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/bottom-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).not.toHaveDistanceFrom(reference, DistanceSide.Bottom, 100);
    });
  });

  test.describe('when measuring distance from left edge', () => {
    test('should have exact distance of 100px from left edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/left-exact.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Left, 100);
    });

    test('should have distance within 10px tolerance from left edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Left, 100, options);
    });

    test('should have distance within 10% tolerance from left edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
      await expect(element).toHaveDistanceFrom(reference, DistanceSide.Left, 100, options);
    });

    test('should fail when distance is outside tolerance from left edge', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/at-distance-from/left-offset.html');
      await page.goto(`file://${htmlPath}`);

      const reference = page.locator('#reference');
      const element = page.locator('#element');
      await expect(element).not.toHaveDistanceFrom(reference, DistanceSide.Left, 100);
    });
  });
});
