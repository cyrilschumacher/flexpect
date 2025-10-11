import { describe, it, jest } from '@jest/globals';
import { expect, Locator } from '@playwright/test';
import { when } from 'jest-when';

import { toHaveAspectRatio } from '@flexpect/matchers/aspect-ratio';
import { BoundingBox, getBoundingBoxOrFail } from '@flexpect/matchers/helpers/get-bounding-box-or-fail';

jest.mock('@flexpect/matchers/helpers/get-bounding-box-or-fail');

describe('toHaveAspectRatio', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when aspect ratio matches exactly', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 16, height: 9 } as BoundingBox;

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => box);

    const result = await toHaveAspectRatio(element, 16 / 9);

    expect(result.message()).toEqual(
      'Element has aspect ratio within 0% tolerance: expected ≈ 1.7778, actual 1.7778 (delta 0.0000).',
    );
    expect(result.pass).toBe(true);
  });

  it('should pass when aspect ratio is within tolerance', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 27, height: 20 } as BoundingBox;

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => box);

    const result = await toHaveAspectRatio(element, 4 / 3, { tolerancePercent: 5 });

    expect(result.message()).toEqual(
      'Element has aspect ratio within 5% tolerance: expected ≈ 1.3333, actual 1.3500 (delta 0.0167).',
    );
    expect(result.pass).toBe(true);
  });

  it('should fail when aspect ratio is outside tolerance', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 28, height: 20 } as BoundingBox;

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => box);

    const result = await toHaveAspectRatio(element, 4 / 3, { tolerancePercent: 2 });

    expect(result.message()).toEqual(`Element's aspect ratio is outside the allowed 2% range.

Details:
- Expected ratio: ~1.3333
- Actual ratio:   1.4000
- Difference:     0.0667 (allowed: ±0.0267)

To fix this, adjust the element's width or height so that its ratio more closely matches the expected 1.3333.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when aspect ratio is outside tolerance', async () => {
    const element = {} as Locator;
    const box = { x: 0, y: 0, width: 22, height: 20 } as BoundingBox;

    when(getBoundingBoxOrFailMock)
      .calledWith(element)
      .mockImplementationOnce(async () => box);

    const result = await toHaveAspectRatio(element, 1);

    expect(result.message()).toEqual(`Element's aspect ratio is outside the allowed 0% range.

Details:
- Expected ratio: ~1.0000
- Actual ratio:   1.1000
- Difference:     0.1000 (allowed: ±0.0000)

To fix this, adjust the element's width or height so that its ratio more closely matches the expected 1.0000.`);
    expect(result.pass).toBe(false);
  });
});
