import { toFitContainer } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toFitContainer matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toFitContainer });
  });

  test('should detect element that fits container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fit-container/fits-container.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).toFitContainer(container);
  });

  test('should reject element that is too small for container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fit-container/too-small.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toFitContainer(container);
  });

  test('should reject element that overflows container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fit-container/overflows-container.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toFitContainer(container);
  });

  test('should reject element with margin that causes overflow', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fit-container/with-margin.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toFitContainer(container);
  });

  test('should reject element with border and padding that exceeds container', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/fit-container/with-border-and-padding.html');
    await page.goto(`file://${htmlPath}`);

    const container = page.locator('#container');
    const element = page.locator('#element');
    await expect(element).not.toFitContainer(container);
  });
});
