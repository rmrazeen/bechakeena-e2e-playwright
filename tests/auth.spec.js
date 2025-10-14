// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage'); // adjust path if needed

test.describe('Bechakena Admin Login Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Create page object and go to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC01 - Valid login should navigate to admin dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin@example.com', 'pa$$word'); // change to valid credentials
    await loginPage.assertSuccessfulLogin(/.*admin/);

    // Optional: verify dashboard element or URL
    await expect(page).toHaveURL(/.*admin/);
  });

  test('TC02 - Blank email and password shows validation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.submitBlankForm();

    // Expect error messages
    await expect(loginPage.emailErrorMessage).toBeVisible();
    await expect(loginPage.passErrorMessage).toBeVisible();
  });

  test('TC03 - Invalid email format shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('invalidEmail', 'somepassword');

    // Expect email error message
    await expect(loginPage.emailErrorMessage).toBeVisible();
  });

  test('TC04 - Missing password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin@bechakena.com', '');

    // Expect password error message
    await expect(loginPage.passErrorMessage).toBeVisible();
  });

  test('TC05 - Password should be masked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.assertPasswordMasked();
  });

  test('TC06 - Logout after successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('admin@example.com', 'pa$$word');
  await loginPage.assertSuccessfulLogin(/.*admin/);

  // Logout using the logout method
  await loginPage.logout();

  // Assert redirected back to login page
  await expect(page).toHaveURL('https://devcore.bechakeena.com/login');
});
});
