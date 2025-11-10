import { Locator, MatcherReturnType } from '@playwright/test';
import { BoundingBox, getBoundingBoxOrFail } from './helpers/get-bounding-box-or-fail';
import { Tolerance, ToleranceUnit } from './tolerance';

function computeSpacing(elementBox: BoundingBox, referenceBox: BoundingBox, axis: SpacingAxis) {
  const elementStart = axis === SpacingAxis.Horizontal ? elementBox.x : elementBox.y;
  const elementEnd = elementStart + (axis === SpacingAxis.Horizontal ? elementBox.width : elementBox.height);
  const referenceStart = axis === SpacingAxis.Horizontal ? referenceBox.x : referenceBox.y;
  const referenceEnd = referenceStart + (axis === SpacingAxis.Horizontal ? referenceBox.width : referenceBox.height);

  const spacing = elementEnd < referenceStart ? referenceStart - elementEnd : elementStart - referenceEnd;
  return Math.max(0, spacing);
}

/**
 * Axis along which spacing is measured.
 */
export enum SpacingAxis {
  /**
   * Measures horizontal spacing (left → right).
   *
   * The gap is calculated between:
   * - The **right edge** of the left element
   * - The **left edge** of the right element
   */
  Horizontal = 'horizontal',

  /**
   * Measures vertical spacing (top → bottom).
   *
   * The gap is calculated between:
   * - The **bottom edge** of the upper element
   * - The **top edge** of the lower element
   */
  Vertical = 'vertical',
}

/**
 * Options for the {@link toHaveSpacingBetween} matcher.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ToHaveSpacingBetweenOptions extends Tolerance {}

/**
 * Asserts that the spacing between two elements matches the expected value along the specified axis.
 *
 * The spacing is calculated as the gap **between** the edges of the two elements:
 * - **Horizontal**: distance between the right edge of the left element and the left edge of the right element.
 * - **Vertical**: distance between the bottom edge of the top element and the top edge of the bottom element.
 *
 * Elements are automatically ordered by position (left → right or top → bottom), regardless of parameter order.
 *
 * - **Horizontal spacing** (axis = `SpacingAxis.Horizontal`):
 *   ```text
 *   [Element A]        [Element B]
 *   |---------|        |---------|
 *             <--16px-->
 *   ```
 *
 * - **Vertical spacing** (axis = `SpacingAxis.Vertical`):
 *   ```text
 *   [Element A]
 *   |----------|
 *        |
 *        | 16px
 *        |
 *   [Element B]
 *   |----------|
 *   ```
 *
 * @param reference - The reference element as a {@link Locator} relative to which spacing is measured.
 * @param expectedSpacing - Expected gap between the two elements, in pixels (≥ 0).
 * @param axis - The axis along which to measure spacing.
 * @param options - Optional spacing options.
 * @returns A {@link Promise} that resolves with the matcher result.
 *
 * @example
 * // Horizontal spacing: exactly 16px
 * await expect(button1).toHaveSpacingBetween(button2, 16, SpacingAxis.Horizontal);
 *
 * @example
 * // Vertical spacing: 24px ± 5%
 * await expect(header).toHaveSpacingBetween(content, 24, SpacingAxis.Vertical, {
 *   tolerance: 5,
 *   toleranceUnit: ToleranceUnit.Percent
 * });
 */
export async function toHaveSpacingBetween(
  element: Locator,
  reference: Locator,
  expectedSpacing: number,
  axis: SpacingAxis,
  options: ToHaveSpacingBetweenOptions = {},
): Promise<MatcherReturnType> {
  const { tolerance = 0, toleranceUnit = ToleranceUnit.Percent } = options;
  if (tolerance < 0) {
    throw new Error('tolerance must be greater than or equal to 0');
  }

  const elementBox = await getBoundingBoxOrFail(element);
  const referenceBox = await getBoundingBoxOrFail(reference);

  const spacing = computeSpacing(elementBox, referenceBox, axis);

  const toleranceInPixels = toleranceUnit === ToleranceUnit.Percent ? (expectedSpacing * tolerance) / 100 : tolerance;
  const delta = Math.abs(spacing - expectedSpacing);
  if (delta <= toleranceInPixels) {
    return {
      pass: true,
      message: () => {
        const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';
        const roundedSpacing = spacing.toFixed(2);
        const roundedTolerance = toleranceInPixels.toFixed(2);

        return `Spacing is ${roundedSpacing}px (${axis}) — within ±${tolerance}${unit} (±${roundedTolerance}px) of ${expectedSpacing}px.`;
      },
    };
  }

  return {
    pass: false,
    message: () => {
      const unit = toleranceUnit === ToleranceUnit.Percent ? '%' : 'px';

      const roundedExpectedSpacing = expectedSpacing.toFixed(2);
      const roundedActualSpacing = spacing.toFixed(2);
      const roundedSpacingDifference = delta.toFixed(2);

      if (axis === SpacingAxis.Horizontal) {
        const leftElement = elementBox.x < referenceBox.x ? elementBox : referenceBox;
        const rightElement = elementBox.x < referenceBox.x ? referenceBox : elementBox;

        const roundedLeftX = leftElement.x.toFixed(2);
        const roundedLeftWidth = leftElement.width.toFixed(2);
        const roundedRightX = rightElement.x.toFixed(2);
        const roundedRightWidth = rightElement.width.toFixed(2);

        return `Horizontal spacing between elements does not match expected value.

Expected:     ${roundedExpectedSpacing}px ±${tolerance}${unit}
Measured:     ${roundedActualSpacing}px
Difference:   ${roundedSpacingDifference}px

Layout details (X axis):
- Left element:   X=${roundedLeftX}, width=${roundedLeftWidth}px
- Right element:  X=${roundedRightX}, width=${roundedRightWidth}px
- Gap between:    ${roundedActualSpacing}px

Use margin, padding, or flex/grid gap to adjust spacing.`;
      }

      const topElement = elementBox.y < referenceBox.y ? elementBox : referenceBox;
      const bottomElement = elementBox.y < referenceBox.y ? referenceBox : elementBox;

      const roundedTopY = topElement.y.toFixed(2);
      const roundedTopHeight = topElement.height.toFixed(2);
      const roundedBottomY = bottomElement.y.toFixed(2);
      const roundedBottomHeight = bottomElement.height.toFixed(2);

      return `Vertical spacing between elements does not match expected value.

Expected:     ${roundedExpectedSpacing}px ±${tolerance}${unit}
Measured:     ${roundedActualSpacing}px
Difference:   ${roundedSpacingDifference}px

Layout details (Y axis):
- Top element:    Y=${roundedTopY}, height=${roundedTopHeight}px
- Bottom element: Y=${roundedBottomY}, height=${roundedBottomHeight}px
- Gap between:    ${roundedActualSpacing}px

Use margin, padding, or flex/grid gap to adjust spacing.`;
    },
  };
}
