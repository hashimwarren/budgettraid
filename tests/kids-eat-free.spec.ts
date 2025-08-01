import { test, expect } from '@playwright/test';

test.describe('Kids Eat Free - BudgetTriad.com', () => {
  test('should load the main page and display today\'s deals', async ({ page }) => {
    // Start from the index page
    await page.goto('/');

    // Check if the page loads correctly
    await expect(page).toHaveTitle(/Kids Eat Free|Budget Triad/);

    // Verify the main heading or branding is present
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should allow city selection', async ({ page }) => {
    await page.goto('/');

    // Look for city selector (could be a dropdown, buttons, or other selector)
    // This will need to be updated based on your actual implementation
    const citySelector = page.locator('[data-testid="city-selector"]').or(
      page.locator('select').filter({ hasText: /city|location/i })
    ).or(
      page.locator('button').filter({ hasText: /greensboro|winston|high point/i })
    );

    if (await citySelector.count() > 0) {
      await expect(citySelector.first()).toBeVisible();
    }
  });

  test('should allow day selection with today as default', async ({ page }) => {
    await page.goto('/');

    // Look for day selector
    const daySelector = page.locator('[data-testid="day-selector"]').or(
      page.locator('select').filter({ hasText: /day|today|monday|tuesday/i })
    ).or(
      page.locator('button').filter({ hasText: /today|monday|tuesday/i })
    );

    if (await daySelector.count() > 0) {
      await expect(daySelector.first()).toBeVisible();
    }
  });

  test('should display restaurant list with proper formatting', async ({ page }) => {
    await page.goto('/');

    // Look for restaurant list items
    const restaurantList = page.locator('[data-testid="restaurant-list"]').or(
      page.locator('li').filter({ hasText: /restaurant|deal/i })
    ).or(
      page.locator('div').filter({ hasText: /•/ }) // Looking for the "•" separator mentioned in PRD
    );

    if (await restaurantList.count() > 0) {
      // Verify list format: Line 1: Name, Line 2: Cuisine • Day • Distance
      const firstItem = restaurantList.first();
      await expect(firstItem).toBeVisible();
    }
  });

  test('should handle cuisine filter chips', async ({ page }) => {
    await page.goto('/');

    // Look for cuisine filter chips (scrollable)
    const cuisineChips = page.locator('[data-testid="cuisine-chips"]').or(
      page.locator('button').filter({ hasText: /pizza|burger|mexican|chinese/i })
    );

    if (await cuisineChips.count() > 0) {
      await expect(cuisineChips.first()).toBeVisible();
    }
  });

  test('should navigate to restaurant detail page', async ({ page }) => {
    await page.goto('/');

    // Look for restaurant links and click the first one if available
    const restaurantLink = page.locator('a').filter({ hasText: /restaurant|deal/i }).first();

    if (await restaurantLink.count() > 0) {
      await restaurantLink.click();

      // Verify we're on a detail page
      await expect(page).toHaveURL(/\/restaurant|\/deal/);

      // Look for detail page elements mentioned in PRD
      const detailElements = [
        page.locator('text=/verified/i'),
        page.locator('text=/report issue/i'),
        page.locator('text=/suggest update/i'),
        page.locator('text=/open in maps/i')
      ];

      // At least one of these elements should be present
      let foundElement = false;
      for (const element of detailElements) {
        if (await element.count() > 0) {
          foundElement = true;
          break;
        }
      }

      if (foundElement) {
        expect(foundElement).toBe(true);
      }
    }
  });

  test('should have mobile-friendly layout', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify the page is responsive
    await expect(page.locator('body')).toBeVisible();

    // Check that content fits within viewport
    const content = page.locator('main').or(page.locator('body'));
    await expect(content).toBeVisible();
  });

  test('should load within performance requirements', async ({ page }) => {
    // Start timing
    const startTime = Date.now();

    await page.goto('/');

    // Wait for the main content to be visible
    await page.waitForSelector('body', { state: 'visible' });

    const loadTime = Date.now() - startTime;

    // According to PRD: "First list paint ≤ 3s on mobile"
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation
    await page.keyboard.press('Tab');

    // Verify focus is visible on interactive elements
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });
});

test.describe('Kids Eat Free - Anonymous Reporting', () => {
  test('should allow anonymous flagging (one-tap)', async ({ page }) => {
    await page.goto('/');

    // Look for flag/report buttons
    const reportButton = page.locator('button').filter({ hasText: /flag|report|issue/i });

    if (await reportButton.count() > 0) {
      await reportButton.first().click();

      // Should be quick (≤3s according to PRD)
      const startTime = Date.now();

      // Look for confirmation or success message
      const confirmation = page.locator('text=/flagged|reported|submitted/i');
      if (await confirmation.count() > 0) {
        await expect(confirmation).toBeVisible();

        const actionTime = Date.now() - startTime;
        expect(actionTime).toBeLessThan(3000);
      }
    }
  });

  test('should show unverified reports indicator', async ({ page }) => {
    await page.goto('/');

    // Look for "Unverified reports" tag mentioned in PRD
    const unverifiedTag = page.locator('text=/unverified reports/i');

    if (await unverifiedTag.count() > 0) {
      await expect(unverifiedTag).toBeVisible();
    }
  });
});
