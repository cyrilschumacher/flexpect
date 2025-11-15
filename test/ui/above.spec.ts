import { expect, test } from '@playwright/test';
import { toBeAbove, ToleranceUnit } from '@flexpect';

import path from 'path';

test.describe('toBeAbove matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeAbove });
  });

  test('should pass when element is strictly above reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/strictly-above.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeAbove(reference);
  });

  test('should pass when element bottom touches reference top', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/touching.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeAbove(reference);
  });

  test('should pass when element is above within percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeAbove(reference, options);
  });

  test('should pass when element is above within pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeAbove(reference, options);
  });

  test('should fail when element is below reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/below.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).not.toBeAbove(reference);
  });

  test('should fail when overlap exceeds percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).not.toBeAbove(reference, options);
  });

  test('should fail when overlap exceeds pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/above/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).not.toBeAbove(reference, options);
  });
});
