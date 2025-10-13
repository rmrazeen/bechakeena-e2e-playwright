// tests/auth.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');

test.describe('Authentication Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Login Functionality', () => {
    test('should login with valid credentials', async ({ page }) => {
      await loginPage.login('admin@example.com', 'pa$word');
      
      // Verify user is logged in by checking for dashboard or home page
      await expect(page.locator('text=/Dashboard|Home/i')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid email', async () => {
      await loginPage.login('invalid@email.com', 'pa$word');
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeDefined();
    });

    test('should show error for invalid password', async () => {
      await loginPage.login('admin@example.com', 'wrongpassword');
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeDefined();
    });

    test('should show error for blank email', async () => {
      await loginPage.login('', 'pa$word');
      
      const emailValidation = await loginPage.getEmailError();
      expect(await emailValidation.isVisible()).toBe(true);
    });

    test('should show error for blank password', async () => {
      await loginPage.login('admin@example.com', '');
      
      const passwordValidation = await loginPage.getPasswordError();
      expect(await passwordValidation.isVisible()).toBe(true);
    });

    test('should have password field masked', async () => {
      const isMasked = await loginPage.passwordIsMasked();
      expect(isMasked).toBe(true);
    });
  });

  test.describe('Logout Functionality', () => {
    test('should logout successfully', async ({ page }) => {
      await loginPage.login('admin@example.com', 'pa$word');
      await expect(page.locator('text=/Dashboard|Home/i')).toBeVisible({ timeout: 10000 });
      
      await loginPage.logout();
      
      await expect(loginPage.loginBtn).toBeVisible();
    });
  });

  test.describe('Forgot Password', () => {
    test('should have forgot password link', async () => {
      const forgotPasswordVisible = await loginPage.forgotLink.isVisible();
      expect(forgotPasswordVisible).toBe(true);
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.forgotLink.click();
      
      await expect(page.locator('text=/Forgot Password|Reset Password/i')).toBeVisible();
    });
  });
});
