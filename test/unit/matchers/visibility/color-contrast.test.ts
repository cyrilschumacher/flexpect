import { describe, it, expect, jest } from '@jest/globals';
import { Locator } from '@playwright/test';
import { toHaveColorContrast } from '@flexpect/matchers/visibility/color-contrast';

describe('toHaveColorContrast', () => {
  it('should pass when contrast is sufficient', async () => {
    const mockEvaluate = jest
      .fn<<R>(expression: (el: HTMLElement) => R) => Promise<R>>()
      .mockResolvedValueOnce({ color: 'rgb(0, 0, 0)', backgroundColor: 'transparent' })
      .mockResolvedValueOnce('rgb(255, 255, 255)');

    const element = { evaluate: mockEvaluate } as unknown as Locator;
    const result = await toHaveColorContrast(element, 4.5);

    expect(result.message()).toEqual('Element color contrast is good, with a ratio of 21.00.');
    expect(result.pass).toBe(true);
  });

  it('should fail when contrast is insufficient', async () => {
    const mockEvaluate = jest
      .fn<<R>(expression: (el: HTMLElement) => R) => Promise<R>>()
      .mockResolvedValueOnce({ color: 'rgb(200, 200, 200)', backgroundColor: 'transparent' })
      .mockResolvedValueOnce('rgb(255, 255, 255)');

    const element = { evaluate: mockEvaluate } as unknown as Locator;
    const result = await toHaveColorContrast(element, 7);

    expect(result.message()).toEqual(`Element does not have sufficient color contrast.

Details:
- Actual contrast ratio: 1.67
- Required contrast ratio: 7:1
- Text color: #C8C8C8 (Luminance: 0.5776)
- Background color: #FFFFFF (Luminance: 1.0000)

Adjust the text or background color to achieve a contrast ratio of at least 7:1.`);
    expect(result.pass).toBe(false);
  });
});
