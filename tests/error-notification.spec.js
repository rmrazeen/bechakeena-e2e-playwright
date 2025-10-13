const { test, expect } = require('@playwright/test');

test.describe('Error & Notification Handling', () => {
  const adminUrl = 'https://devcore.bechakeena.com';
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';

  test.beforeEach(async ({ page }) => {
    await page.goto(adminUrl);
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('7.1.1 - Verify toast/alert on success (product creation)', async ({ page }) => {
    await page.click('text=Products');
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="name"]', 'Success Test Product');
    await page.fill('input[name="price"]', '50.00');
    await page.click('button:has-text("Create")');
    await expect(page.locator('.toast-success, .alert-success')).toBeVisible(); // Adjust for success toast
    await expect(page.locator('text=Product created successfully')).toBeVisible();
  });

  test('7.1.2 - Verify toast/alert on failure (invalid product creation)', async ({ page }) => {
    await page.click('text=Products');
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="price"]', 'invalid');
    await page.click('button:has-text("Create")');
    await expect(page.locator('.toast-error, .alert-error')).toBeVisible(); // Adjust for error toast
    await expect(page.locator('text=Invalid price')).toBeVisible();
  });

  test('7.1.3 - Verify notifications in other modules (e.g., order update success)', async ({ page }) => {
    await page.click('text=Orders');
    await page.click('.order-item:first-child .status-dropdown');
    await page.selectOption('.status-dropdown', 'shipped');
    await page.click('button:has-text("Update Status")');
    await expect(page.locator('.toast-success')).toContainText('Status updated');
  });

  test('7.2.1 - Graceful handling of invalid operations (delete in-use item)', async ({ page }) => {
    await page.click('text=Products');
    // Assume product is in-use (has orders)
    await page.click('text=Delete'); // For an in-use product
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('.toast-warning')).toContainText('Cannot delete in-use product'); // Prevent deletion with message
    // Or redirect/keep item
  });

  test('7.2.2 - Graceful handling of network errors', async ({ page }) => {
    // Simulate by mocking offline, but for now test a forced failure
    await page.route('**/api/invalid', route => route.abort());
    await page.click('button:has-text("Save")'); // In a form
    await expect(page.locator('text=Network error, please retry')).toBeVisible(); // Graceful error message
  });

  test('7.2.3 - Invalid input handling with clear messages', async ({ page }) => {
    await page.goto('/products/new'); // It's better to use page.goto if direct path known
    await page.fill('input[name="name"]', ''); // Required field
    await page.click('button:has-text("Create")');
    await expect(page.locator('.field-error:has-text("Name is required")')).toBeVisible();
  });

  test('7.2.4 - Permission errors graceful handling', async ({ page, context }) => {
    // Using non-admin user from previous if possible, but create inline
    const userPage = await context.newPage();
    await userPage.goto(adminUrl);
    await userPage.fill('input[placeholder="Email"]', 'restricted@example.com'); // Assume restricted user
    await userPage.fill('input[placeholder="Password"]', 'pass');
    await userPage.click('button:has-text("Sign in")');
    await userPage.click('text=Restricted Section');
    await expect(userPage.locator('text=You do not have permission')).toBeVisible(); // Redirect or message
    await userPage.close();
  });
});
