import { SpacingAxis, toHaveSpacingBetween } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toHaveSpacingBetween matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toHaveSpacingBetween });
  });

  test.describe('Horizontal spacing', () => {
    test('should pass with exact horizontal spacing of 16px', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-exact.html');
      await page.goto(`file://${htmlPath}`);

      const elementA = page.locator('#element-a');
      const elementB = page.locator('#element-b');
      await expect(elementA).toHaveSpacingBetween(elementB, 16, SpacingAxis.Horizontal);
    });

    test('should pass with horizontal spacing within 10% tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-within-tolerance.html');
      await page.goto(`file://${htmlPath}`);

      const elementA = page.locator('#element-a');
      const elementB = page.locator('#element-b');
      await expect(elementA).toHaveSpacingBetween(elementB, 20, SpacingAxis.Horizontal, {
        tolerancePercent: 10,
      });
    });

    test('should fail when horizontal spacing is too small', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-too-small.html');
      await page.goto(`file://${htmlPath}`);

      const elementA = page.locator('#element-a');
      const elementB = page.locator('#element-b');
      await expect(elementA).not.toHaveSpacingBetween(elementB, 30, SpacingAxis.Horizontal);
    });

    test('should fail when horizontal spacing is too large', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-too-large.html');
      await page.goto(`file://${htmlPath}`);

      const elementA = page.locator('#element-a');
      const elementB = page.locator('#element-b');
      await expect(elementA).not.toHaveSpacingBetween(elementB, 10, SpacingAxis.Horizontal);
    });

    test('should pass regardless of element order', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-exact.html');
      await page.goto(`file://${htmlPath}`);

      const elementB = page.locator('#element-b');
      const elementA = page.locator('#element-a');
      await expect(elementB).toHaveSpacingBetween(elementA, 16, SpacingAxis.Horizontal);
    });
  });

  test.describe('Vertical spacing', () => {
    test('should pass with exact vertical spacing of 24px', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/vertical-exact.html');
      await page.goto(`file://${htmlPath}`);

      const header = page.locator('#header');
      const content = page.locator('#content');
      await expect(header).toHaveSpacingBetween(content, 24, SpacingAxis.Vertical);
    });

    test('should pass with vertical spacing within 5% tolerance', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/vertical-within-tolerance.html');
      await page.goto(`file://${htmlPath}`);

      const header = page.locator('#header');
      const content = page.locator('#content');
      await expect(header).toHaveSpacingBetween(content, 30, SpacingAxis.Vertical, {
        tolerancePercent: 5,
      });
    });

    test('should fail when elements overlap vertically', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/vertical-overlap.html');
      await page.goto(`file://${htmlPath}`);

      const top = page.locator('#top');
      const bottom = page.locator('#bottom');
      await expect(top).not.toHaveSpacingBetween(bottom, 20, SpacingAxis.Vertical);
    });

    test('should fail when vertical spacing is too large', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/vertical-too-large.html');
      await page.goto(`file://${htmlPath}`);

      const top = page.locator('#top');
      const bottom = page.locator('#bottom');
      await expect(top).not.toHaveSpacingBetween(bottom, 10, SpacingAxis.Vertical);
    });
  });

  test.describe('Edge cases', () => {
    test('should pass when elements overlap (spacing = 0)', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-overlap.html');
      await page.goto(`file://${htmlPath}`);

      const left = page.locator('#left');
      const right = page.locator('#right');
      await expect(left).toHaveSpacingBetween(right, 0, SpacingAxis.Horizontal);
    });

    test('should fail with negative expected spacing', async ({ page }) => {
      const htmlPath = path.resolve(__dirname, 'assets/spacing-between/horizontal-exact.html');
      await page.goto(`file://${htmlPath}`);

      const elementA = page.locator('#element-a');
      const elementB = page.locator('#element-b');

      await expect(async () => {
        await expect(elementA).toHaveSpacingBetween(elementB, -5, SpacingAxis.Horizontal);
      }).rejects.toThrow('Expected spacing must be non-negative');
    });
  });
});
