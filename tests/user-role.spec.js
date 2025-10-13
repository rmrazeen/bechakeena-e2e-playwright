const { test, expect } = require('@playwright/test');

test.describe('User & Role Management', () => {
  const adminUrl = 'https://devcore.bechakeena.com';
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';
  const newUserEmail = 'newuser@example.com';
  const newUserPassword = 'NewPass123';

  test.beforeEach(async ({ page }) => {
    await page.goto(adminUrl);
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('5.1.1 - User addition', async ({ page }) => {
    await page.click('text=Users'); // Navigate to users
    await page.click('button:has-text("Add User")');
    await page.fill('input[name="email"]', newUserEmail);
    await page.fill('input[name="password"]', newUserPassword);
    await page.fill('input[name="name"]', 'New User');
    await page.selectOption('select[name="role"]', 'staff'); // Adjust role option
    await page.click('button:has-text("Create User")');
    await expect(page.locator('text=User created successfully')).toBeVisible();
    // Verify user in list
    await expect(page.locator('.user-list')).toContainText(newUserEmail);
  });

  test('5.1.2 - Role assignment', async ({ page }) => {
    await page.click('text=Users');
    await page.click('.user-item:has-text("New User") .edit-button'); // Edit existing
    await page.selectOption('select[name="role"]', 'manager');
    await page.click('button:has-text("Update Role")');
    await expect(page.locator('.user-item:has-text("New User") .role')).toContainText('Manager');
  });

  test('5.1.3 - Access control verification', async ({ page, context }) => {
    // Login as new user to test access
    const userPage = await context.newPage();
    await userPage.goto(adminUrl);
    await userPage.fill('input[placeholder="Email"]', newUserEmail);
    await userPage.fill('input[placeholder="Password"]', newUserPassword);
    await userPage.click('button:has-text("Sign in")');
    
    // Try to access admin-only feature, e.g., settings
    await userPage.click('text=Settings');
    await expect(userPage.locator('text=Access Denied')).toBeVisible(); // Or 403 redirect
    await userPage.close();
  });

  test('5.2.1 - Verify restricted features for non-admin roles', async ({ page, context }) => {
    // Similar to above, test multiple restricted sections
    const userPage = await context.newPage();
    await userPage.goto(adminUrl);
    await userPage.fill('input[placeholder="Email"]', newUserEmail);
    await userPage.fill('input[placeholder="Password"]', newUserPassword);
    await userPage.click('button:has-text("Sign in")');
    
    await userPage.click('text=Users'); // Try to manage users as staff
    await expect(userPage.locator('text=Insufficient permissions')).toBeVisible();
    
    // Test product management access if restricted
    await userPage.click('text=Products');
    await expect(userPage.locator('button:has-text("Add Product")')).toBeDisabled();
    
    await userPage.close();
  });
});
