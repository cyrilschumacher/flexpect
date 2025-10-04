# flexpect

[![MIT License][license-image]][license-url]
[![CI][ci-image]][ci-url]
[![Release][release-image]][release-url]
[![semantic-release: angular][semantic-release-image]][semantic-release-url]

> Automated layout validation tool using Playwright. Ensures responsive design accuracy across multiple viewports by inspecting element positions and visual alignment.

Ensuring consistent visual alignment across responsive layouts is a recurring challenge in front-end development. Small CSS changes or unintended layout shifts can break the alignment between related elements (for example, labels and inputs, icons and text blocks, or mirrored components across mobile and desktop pages), and these regressions are often hard to catch with functional tests alone. Visual test snapshots help, but they can be noisy and brittle for layout-specific assertions.

This library provides Playwright matchers focused specifically on geometric relationships between elements: **horizontal and vertical alignment, equal widths or heights, centered positioning, and other spatial checks**. By expressing layout expectations as deterministic assertions, teams can:

- Detect regressions in alignment early
- Prevent cascading visual bugs
- Keep responsive pages consistent between mobile and desktop variants

The matchers integrate naturally with Playwright tests and return clear diagnostics (positions and sizes) to make failures actionable and reduce the feedback loop for front-end fixes.

## Installation

```bash
npm install --save-dev flexpect
```

Then import/register the matchers in your Playwright test setup (example shows the typical approach—adjust to your test runner setup):

```typescript
// playwright.config.ts or global-setup file
import 'flexpect/register'; // registers custom expect matchers
```

## Quick start

Example: assert two elements are horizontally aligned within a 2px tolerance.

```typescript
// test.spec.ts
test('labels align with inputs', async ({ page }) => {
  const label = await page.locator('label[for="email"]');
  const input = await page.locator('#email');
  await expect(label).toBeAlignedWith(input, { axis: 'horizontal', tolerancePercent: 2 });
});
```

Example: assert same width

```typescript
await expect(cardA).toHaveSameWidthAs(cardB, { tolerancePercent: 1 });
```

## Examples

- Cross-breakpoint consistency: run the same assertions on a mobile and desktop viewport to ensure responsive parity.
- Form layout invariants: label baseline alignment, icon alignment inside buttons.
- Component contract tests: enforce that mirrored components keep the same width/height across variants.

See the `test` folder for full test files and fixtures.

## Contributing

Contributions welcome. Workflow:

- Fork the repository.
- Create a feature branch: git checkout -b feat/my-feature
- Commit changes and push.
- Open a pull request describing the change and rationale; include tests where possible.

Please follow the existing code style and include unit and integration tests for new matchers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[ci-image]: https://github.com/cyrilschumacher/flexpect/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/cyrilschumacher/flexpect/actions/workflows/ci.yml
[release-image]: https://github.com/cyrilschumacher/flexpect/actions/workflows/release.yml/badge.svg?branch=main
[release-url]: https://github.com/cyrilschumacher/flexpect/actions/workflows/release.yml
[semantic-release-image]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release
[semantic-release-url]: https://github.com/semantic-release/semantic-release
