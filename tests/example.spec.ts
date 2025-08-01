import { test, expect } from '@playwright/test';

test('should load the home page', async ({ page }) => {
  await page.goto('/');

  // Verify the page loads correctly
  await expect(page).toHaveURL('/');
  await expect(page.locator('body')).toBeVisible();
});

test('should be responsive', async ({ page }) => {
  // Test mobile viewport (important for BudgetTriad mobile-first design)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  // Verify page loads correctly on mobile
  await expect(page.locator('body')).toBeVisible();

  // Test desktop viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
});

test('should have basic page structure', async ({ page }) => {
  await page.goto('/');

  // Basic performance check - page should load within reasonable time
  const startTime = Date.now();
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;

  // Should load reasonably fast (within 5 seconds for development)
  expect(loadTime).toBeLessThan(5000);

  // Check that basic HTML structure is present
  await expect(page.locator('html')).toBeVisible();
  await expect(page.locator('body')).toBeVisible();
});
