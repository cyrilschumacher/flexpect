import { expect, test } from '@playwright/test';
import { toBeRightOf, ToleranceUnit } from '@flexpect';

import path from 'path';

test.describe('toBeRightOf matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toBeRightOf });
  });

  test('should pass when element is strictly to the right of reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/strictly-right.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeRightOf(reference);
  });

  test('should pass when element left touches reference right', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/touching.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).toBeRightOf(reference);
  });

  test('should pass when element is to the right within percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).toBeRightOf(reference, options);
  });

  test('should pass when element is to the right within pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/overlap-within-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 15, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).toBeRightOf(reference, options);
  });

  test('should fail when element is to the left of reference', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/left.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    await expect(element).not.toBeRightOf(reference);
  });

  test('should fail when overlap exceeds percentage tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 5, toleranceUnit: ToleranceUnit.Percent };
    await expect(element).not.toBeRightOf(reference, options);
  });

  test('should fail when overlap exceeds pixel tolerance', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/right-of/overlap-out-of-tolerance.html');
    await page.goto(`file://${htmlPath}`);

    const element = page.locator('#element');
    const reference = page.locator('#reference');
    const options = { tolerance: 10, toleranceUnit: ToleranceUnit.Pixels };
    await expect(element).not.toBeRightOf(reference, options);
  });
});
