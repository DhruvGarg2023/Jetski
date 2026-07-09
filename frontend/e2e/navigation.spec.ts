import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  // Use a simulated logged-in state or bypass auth for frontend UI tests.
  // Assuming the user is redirected to /dashboard when authenticated.
  // For this test, we can mock localStorage or just test the routes if they don't strictly require a real backend token for layout render.

  test.beforeEach(async ({ page }) => {
    // Mock authentication if necessary or just go to page
    // By setting localStorage item for 'auth_token'
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    });
  });

  test('should navigate to Dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Ensure Topbar or Dashboard elements load
    await expect(page.getByText('Test User')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Total Projects')).toBeVisible();
  });

  test('should navigate to Repositories', async ({ page }) => {
    await page.goto('/dashboard');
    // Click on sidebar link
    await page.click('text=Repositories');
    await expect(page).toHaveURL(/.*\/repositories/);
    await expect(page.getByRole('heading', { name: 'Connected Repositories' })).toBeVisible();
  });

  test('should navigate to Settings', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Settings');
    await expect(page).toHaveURL(/.*\/settings/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});
