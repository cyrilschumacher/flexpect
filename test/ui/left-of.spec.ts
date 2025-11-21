import { expect, test } from '@playwright/test';
import { toBeLeftOf, ToleranceUnit } from '@flexpect';

import path from 'path';

test.describe('toBeLeftOf matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeLeftOf });
  });

  test('should pass when element is strictly to the left of reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/strictly-left.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeLeftOf(reference);
  });

  test('should pass when element right touches reference left', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/touching.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeLeftOf(reference);
  });

  test('should pass when element is to the left within percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeLeftOf(reference, options);
  });

  test('should pass when element is to the left within pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeLeftOf(reference, options);
  });

  test('should fail when element is to the right of reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/right.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).not.toBeLeftOf(reference);
  });

  test('should fail when overlap exceeds percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).not.toBeLeftOf(reference, options);
  });

  test('should fail when overlap exceeds pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/left-of/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).not.toBeLeftOf(reference, options);
  });
});
