import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testUser = {
    name: 'E2E New User',
    email: 'newuser@example.com',
    password: 'Password123!',
  };

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // Check for the submit button and click it
    await page.click('button[type="submit"]');

    // Wait for redirection to verification page or success state
    await expect(page).toHaveURL(/.*verify-email.*/);
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('should fail login with incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', 'WrongPassword456');
    
    await page.click('button[type="submit"]');

    // Wait for the error toast or message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
  
  test('should login with correct credentials if verified', async ({ page }) => {
    // Note: Since email verification is required, a pure E2E test without database seeding
    // would get stuck at "verify email". For a robust E2E, we'd seed the DB with a verified user.
    // Assuming there is a seeded user: test@example.com / Password123!
    
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
