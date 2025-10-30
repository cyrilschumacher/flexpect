import { describe, it, expect } from '@jest/globals';

describe('registerMatchers', () => {
  it('should extend expect with matchers', async () => {
    const mockExtend = jest.fn();
    jest.mock('@playwright/test', () => ({
      expect: { extend: mockExtend },
    }));

    await import('@flexpect/register');

    expect(mockExtend).toHaveBeenCalledTimes(1);

    const matchers = mockExtend.mock.lastCall[0];
    expect(matchers).toHaveProperty('toBeAlignedWith');
    expect(matchers).toHaveProperty('toNotOverlapWith');
  });

  it('should not extend expect if not imported', () => {
    const mockExtend = jest.fn();
    jest.mock('@playwright/test', () => ({
      expect: { extend: mockExtend },
    }));

    expect(mockExtend).not.toHaveBeenCalled();
  });
});
