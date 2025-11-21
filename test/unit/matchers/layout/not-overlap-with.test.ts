import { describe, it, jest } from '@jest/globals';
import { Locator, expect } from '@playwright/test';
import { when } from 'jest-when';

import { getBoundingBoxOrFail } from '@helpers/get-bounding-box-or-fail';
import { toNotOverlapWith } from '@flexpect/matchers/layout/not-overlap-with';

jest.mock('@helpers/get-bounding-box-or-fail');

describe('toNotOverlapWith', () => {
  const getBoundingBoxOrFailMock = jest.mocked(getBoundingBoxOrFail);

  it('should pass when elements do not overlap at all', async () => {
    const target = {} as Locator;
    const targetBox = { x: 10, y: 10, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(target).mockResolvedValueOnce(targetBox);

    const reference = {} as Locator;
    const referenceBox = { x: 100, y: 100, width: 50, height: 50 } as never;
    when(getBoundingBoxOrFailMock).calledWith(reference).mockResolvedValueOnce(referenceBox);

    const result = await toNotOverlapWith(target, reference);

    expect(result.message()).toEqual('Elements do not overlap within the expected layout boundaries.');
    expect(result.pass).toBe(true);
  });

  it('should fail when elements partially overlap', async () => {
    const target = {} as Locator;
    const targetBox = { x: 50, y: 50, width: 60, height: 60 };

    const reference = {} as Locator;
    const referenceBox = { x: 80, y: 80, width: 50, height: 50 };

    when(getBoundingBoxOrFailMock)
      .calledWith(target)
      .mockImplementationOnce(async () => targetBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(reference)
      .mockImplementationOnce(async () => referenceBox);

    const result = await toNotOverlapWith(target, reference);

    expect(result.message()).toEqual(`Elements overlap unexpectedly.

Details:
- Intersection area: 900.00px²
- Overlap width:     30.00px
- Overlap height:    30.00px

Adjust the layout or positioning to ensure the elements do not overlap.`);
    expect(result.pass).toBe(false);
  });

  it('should fail when one element fully overlaps another', async () => {
    const target = {} as Locator;
    const targetBox = { x: 0, y: 0, width: 100, height: 100 };

    const other = {} as Locator;
    const otherBox = { x: 0, y: 0, width: 100, height: 100 };

    when(getBoundingBoxOrFailMock)
      .calledWith(target)
      .mockImplementationOnce(async () => targetBox);
    when(getBoundingBoxOrFailMock)
      .calledWith(other)
      .mockImplementationOnce(async () => otherBox);

    const result = await toNotOverlapWith(target, other);

    expect(result.message()).toEqual(`Elements overlap unexpectedly.

Details:
- Intersection area: 10000.00px²
- Overlap width:     100.00px
- Overlap height:    100.00px

Adjust the layout or positioning to ensure the elements do not overlap.`);
    expect(result.pass).toBe(false);
  });
});
