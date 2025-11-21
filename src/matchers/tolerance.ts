/** @internal */
export function getToleranceUnitSymbol(toleranceUnit: ToleranceUnit): string {
  return toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
}

/** @internal */
export function validateTolerance(tolerance: number): void {
  if (tolerance < 0) {
    throw new Error('"tolerance" must be greater than or equal to 0');
  }
}

/**
 * Units available for expressing tolerance values.
 */
export enum ToleranceUnit {
  /**
   * Tolerance is expressed as a percentage of a reference dimension
   * (e.g., width, height, or distance).
   */
  Percent,

  /**
   * Tolerance is expressed as an absolute value in pixels.
   */
  Pixels,
}

/**
 * Describes a tolerance value that defines how much deviation
 * from the expected result is acceptable for a matcher.
 *
 * This type can be reused across different matchers (e.g. alignment, spacing,
 * size comparison) to allow flexible tolerance configuration.
 *
 * By default, the tolerance is expressed as a percentage, but a pixel-based
 * value can also be used for more precise, fixed-size comparisons.
 *
 * @example
 * // Allow up to 5% difference
 * { tolerance: 5, toleranceUnit: ToleranceUnit.Percent }
 *
 * @example
 * // Allow up to 3 pixels difference
 * { tolerance: 3, toleranceUnit: ToleranceUnit.Pixels }
 */
export interface Tolerance {
  /**
   * Allowed tolerance value.
   *
   * Must be greater than or equal to 0. Omitting this option defaults to `0`,
   * which will typically cause the assertion to fail or throw an error,
   * since zero tolerance is allowed.
   */
  tolerance?: number;

  /**
   * Defines the unit in which the tolerance is expressed.
   *
   * Defaults to `percent` if not specified.
   *
   * @default ToleranceUnit.Percent
   */
  toleranceUnit?: ToleranceUnit;
}
