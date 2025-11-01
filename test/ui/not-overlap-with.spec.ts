import { toNotOverlapWith } from '@flexpect';
import { expect, test } from '@playwright/test';

import path from 'path';

test.describe('toNotOverlapWith matcher', () => {
  test.beforeAll(() => {
    expect.extend({ toNotOverlapWith });
  });

  test('should pass when elements do not overlap', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/not-overlap-with/no-overlap.html');
    await page.goto(`file://${htmlPath}`);

    const target = page.locator('#elementA');
    const reference = page.locator('#elementB');
    await expect(target).toNotOverlapWith(reference);
  });

  test('should pass when elements only touch edges (no overlap)', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/not-overlap-with/touching-edges.html');
    await page.goto(`file://${htmlPath}`);

    const target = page.locator('#elementA');
    const reference = page.locator('#elementB');
    await expect(target).toNotOverlapWith(reference);
  });

  test('should fail when elements overlap horizontally', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/not-overlap-with/overlap-horizontal.html');
    await page.goto(`file://${htmlPath}`);

    const target = page.locator('#elementA');
    const reference = page.locator('#elementB');
    await expect(target).not.toNotOverlapWith(reference);
  });

  test('should fail when elements overlap vertically', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/not-overlap-with/overlap-vertical.html');
    await page.goto(`file://${htmlPath}`);

    const target = page.locator('#elementA');
    const reference = page.locator('#elementB');
    await expect(target).not.toNotOverlapWith(reference);
  });

  test('should fail when one element is fully contained within another', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, 'assets/not-overlap-with/contained-overlap.html');
    await page.goto(`file://${htmlPath}`);

    const target = page.locator('#inner');
    const reference = page.locator('#outer');
    await expect(target).not.toNotOverlapWith(reference);
  });
});
