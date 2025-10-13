const { test, expect } = require('@playwright/test');

test.describe('Settings & Configuration', () => {
  const adminUrl = 'https://devcore.bechakeena.com';
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';

  test.beforeEach(async ({ page }) => {
    await page.goto(adminUrl);
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/.*dashboard/);
    await page.click('text=Settings'); // Navigate to settings
  });

  test('6.1.1 - Validate general settings', async ({ page }) => {
    await page.fill('input[name="site-name"]', 'Bechakena Updated'); // Adjust for general settings fields
    await page.fill('input[name="site-url"]', 'https://updated.bechakeena.com');
    await page.click('button:has-text("Save General")');
    await expect(page.locator('text=General settings saved')).toBeVisible();
  });

  test('6.1.2 - Email templates configuration', async ({ page }) => {
    await page.click('text=Email Templates'); // Sub-section if applicable
    await page.fill('textarea[name="order-confirmation-template"]', 'Custom template body'); // Adjust
    await page.click('button:has-text("Update Template")');
    await expect(page.locator('text=Template updated')).toBeVisible();
  });

  test('6.1.3 - Notification configurations', async ({ page }) => {
    await page.click('text=Notifications'); // Sub-section
    await page.check('input[name="email-notifications"]');
    await page.check('input[name="sms-notifications"]'); // Adjust options
    await page.fill('input[name="notification-email"]', 'notifications@bechakeena.com');
    await page.click('button:has-text("Save Notifications")');
    await expect(page.locator('text=Notification settings saved')).toBeVisible();
  });

  test('6.2.1 - Persistence after save/reload', async ({ page }) => {
    // Update a setting
    await page.fill('input[name="site-name"]', 'Test Persistence');
    await page.click('button:has-text("Save General")');
    
    // Reload page
    await page.reload();
    
    // Verify persists
    await expect(page.locator('input[name="site-name"]')).toHaveValue('Test Persistence');
  });

  test('6.2.2 - Persistence for email templates after reload', async ({ page }) => {
    await page.click('text=Email Templates');
    await page.fill('textarea[name="order-confirmation-template"]', 'Persisted template');
    await page.click('button:has-text("Update Template")');
    
    await page.reload();
    await expect(page.locator('textarea[name="order-confirmation-template"]')).toHaveValue(/Persisted template/);
  });
});
