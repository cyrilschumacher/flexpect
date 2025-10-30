# flexpect

[![NPM Package][npm-package-image]][npm-package-url]
[![MIT License][license-image]][license-url]
[![CI][ci-image]][ci-url]
[![Codacy][codacy-image]][codacy-url]
[![codecov][codecov-image]][codecov-url]

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

To register all matchers automatically, you can still use:

```typescript
// playwright.config.ts or global-setup file
import 'flexpect/register'; // registers custom expect matchers
```

If you prefer not to register all matchers provided by flexpect, you can import and register only the ones you need manually in your Playwright setup (or any other test runner like Jest or Vitest):

```typescript
import { expect } from '@playwright/test';
import { toBeAlignedWith, toHaveAspectRatio } from 'flexpect';

// Register only the matchers you need
expect.extend({ toBeAlignedWith, toHaveAspectRatio });
```

This approach allows you to:

- load only the matchers you actually use,
- keep full control over which matchers are registered in your test environment.

## Quick start

Example: assert two elements are horizontally aligned within a 2px tolerance.

```typescript
// test.spec.ts
test('labels align with inputs', async ({ page }) => {
  const label = await page.locator('label[for="email"]');
  const input = await page.locator('#email');
  await expect(label).toBeAlignedWith(input, Axis.Horizontal, Alignment.Start, { tolerancePercent: 2 });
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

For detailed documentation on all available matchers and their usage, please visit the [documentation](https://cyrilschumacher.github.io/flexpect/).

## Contributing

Contributions welcome. Workflow:

- Fork the repository.
- Create a feature branch: git checkout -b feat/my-feature
- Commit changes and push.
- Open a pull request describing the change and rationale; include tests where possible.

Please follow the existing code style and include unit and integration tests for new matchers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[npm-package-image]: https://img.shields.io/npm/v/flexpect
[npm-package-url]: https://www.npmjs.com/package/flexpect
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[ci-image]: https://github.com/cyrilschumacher/flexpect/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/cyrilschumacher/flexpect/actions/workflows/ci.yml
[codecov-image]: https://codecov.io/gh/cyrilschumacher/flexpect/graph/badge.svg?token=RTYOKUQF7Z
[codecov-url]: https://codecov.io/gh/cyrilschumacher/flexpect
[codacy-image]: https://app.codacy.com/project/badge/Grade/a908d94ab6ef47bc90ff07512a5519bb
[codacy-url]: https://app.codacy.com/gh/cyrilschumacher/flexpect/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade
