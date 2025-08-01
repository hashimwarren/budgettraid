# Playwright E2E Testing Setup

This project uses Playwright for end-to-end testing following the Next.js testing guidelines.

## ✅ Installation Complete

Playwright has been successfully installed and configured for your BudgetTriad project with:
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile device testing (Pixel 5, iPhone 12)
- Automatic Next.js server management
- GitHub Actions CI/CD workflow

## Getting Started

### Running Tests

#### Quick Start
```bash
# This will automatically build, start the server, and run tests
npm run test:e2e
```

#### Manual Server Control (Recommended for Development)
```bash
# Kill any existing server on port 3000
npx kill-port 3000

# Build and start the application
npm run build
npm run start

# In another terminal window, run tests
npm run test:e2e
```

#### Test Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/example.spec.ts

# Run only on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run only mobile tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Browser Support
Tests run on:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test Files Location
- Main tests: `tests/`
- Example tests: `tests/example.spec.ts`
- Kids Eat Free specific tests: `tests/kids-eat-free.spec.ts`

### Configuration
The Playwright configuration is in `playwright.config.ts` and includes:
- Base URL set to `http://localhost:3000`
- Automatic server startup with `npm run start`
- Mobile testing enabled
- Trace collection on first retry
- HTML reporter

### Writing Tests
Follow these patterns when writing new tests:

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');

  // Use data-testid attributes for reliable element selection
  await expect(page.locator('[data-testid="my-element"]')).toBeVisible();

  // Or use semantic selectors
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});
```

### Best Practices
1. Use `data-testid` attributes for test-specific element selection
2. Test user workflows, not implementation details
3. Keep tests independent and atomic
4. Use meaningful test descriptions
5. Test mobile responsiveness (this is a mobile-first app)
6. Consider performance requirements (≤3s load time per PRD)

### CI/CD Integration
The setup includes GitHub Actions workflow in `.github/workflows/playwright.yml` for automated testing in CI.

### Debugging Tests
```bash
# Debug mode
npx playwright test --debug

# Generate code for interactions
npx playwright codegen localhost:3000

# View test reports
npx playwright show-report
```

### Performance Testing
The tests include performance assertions based on the PRD requirements:
- First list paint ≤ 3s on mobile
- Anonymous flag in ≤3s

### Accessibility Testing
Basic accessibility tests are included:
- Keyboard navigation
- Focus visibility
- Large tap targets (mobile-first design)
