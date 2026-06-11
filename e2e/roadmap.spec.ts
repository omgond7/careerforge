import { test, expect } from '@playwright/test';

test.describe('Roadmap Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming test@example.com is seeded and verified
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to roadmap, submit generation request, and see loading state', async ({ page }) => {
    await page.goto('/roadmap');

    // Wait for the form to render
    await expect(page.locator('text=Generate Career Roadmap')).toBeVisible();

    // Fill out the role input
    await page.fill('input[placeholder*="Role"]', 'Senior React Developer');

    // Submit the form
    await page.click('button:has-text("Generate")');

    // Verify the UI enters a loading state (from useAsyncJob)
    await expect(page.locator('text=Generating')).toBeVisible();

    // Note: In a real test against a mock, this would eventually resolve to the visualization.
    // For this E2E test against a live background job, we assert it entered the polling state.
  });
});
