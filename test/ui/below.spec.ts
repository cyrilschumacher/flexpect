import { expect, test } from '@playwright/test';
import { toBeBelow, ToleranceUnit } from '@flexpect';

import path from 'path';

test.describe('toBeBelow matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeBelow });
  });

  test('should pass when element is strictly below reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/strictly-below.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeBelow(reference);
  });

  test('should pass when element top touches reference bottom', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/touching.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeBelow(reference);
  });

  test('should pass when element is below within percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeBelow(reference, options);
  });

  test('should pass when element is below within pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeBelow(reference, options);
  });

  test('should fail when element is above reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/above.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).not.toBeBelow(reference);
  });

  test('should fail when overlap exceeds percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).not.toBeBelow(reference, options);
  });

  test('should fail when overlap exceeds pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/below/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).not.toBeBelow(reference, options);
  });
});
