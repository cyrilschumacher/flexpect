import { describe, it, expect } from '@jest/globals';
import { rgbToHex, parseToRGB } from '@helpers/rgb-to-hex';

describe('rgbToHex', () => {
  it.each([
    [{ r: 255, g: 255, b: 255 }, '#FFFFFF'],
    [{ r: 0, g: 0, b: 0 }, '#000000'],
    [{ r: 171, g: 205, b: 239 }, '#ABCDEF'],
    [{ r: 10, g: 20, b: 30 }, '#0A141E'],
  ])('For %p as color, should convert to "%s"', (color, expected) => {
    const hexColor = rgbToHex(color);
    expect(hexColor).toBe(expected);
  });

  it.each([
    [{ r: 300, g: -50, b: 128 }, '#FF0080'],
    [{ r: 999, g: 999, b: -999 }, '#FFFF00'],
    [{ r: -1, g: 256, b: 100 }, '#00FF64'],
  ])('For %p as color, should clamp to "%s"', (color, expected) => {
    const hexColor = rgbToHex(color);
    expect(hexColor).toBe(expected);
  });

  it.each([
    [{ r: 9, g: 15, b: 0 }, '#090F00'],
    [{ r: 1, g: 2, b: 3 }, '#010203'],
  ])('For %p as color, should pad to "%s"', (color, expected) => {
    const hexColor = rgbToHex(color);
    expect(hexColor).toBe(expected);
  });
});

describe('parseToRGB', () => {
  it.each([
    ['rgb(100,150,200)', { r: 100, g: 150, b: 200 }],
    ['rgb(  10  ,  20  ,  30  )', { r: 10, g: 20, b: 30 }],
    ['rgb(0,0,0)', { r: 0, g: 0, b: 0 }],
    ['rgb(255, 255, 255)', { r: 255, g: 255, b: 255 }],
    ['RGB(255,0,0)', { r: 255, g: 0, b: 0 }],
  ])('For "%s" as string, should parse to %p', (str, expected) => {
    const rgb = parseToRGB(str);
    expect(rgb).toEqual(expected);
  });

  it.each([
    'rgb(100, 150)',
    'rgb(100, 150, 200, 1)',
    'rgba(100, 150, 200, 1)',
    'rgb(100, 150, abc)',
    '',
    'rgb (10,20,30)',
  ])('For "%s" as string, should throw an error', (input) => {
    expect(() => parseToRGB(input)).toThrow(`Invalid color format: ${input}. Expected rgb(r, g, b).`);
  });

  it.each([
    ['rgb(256,0,0)', 'Invalid alpha value: 256. Expected a number between 0 and 255.'],
    ['rgb(999,10,10)', 'Invalid alpha value: 999. Expected a number between 0 and 255.'],
  ])('should throw an error when a color component is greater than 255: "%s"', (input, message) => {
    expect(() => parseToRGB(input)).toThrow(message);
  });
});
