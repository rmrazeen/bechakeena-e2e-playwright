const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Authentication', () => {
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';
  const invalidEmail = 'invalid@example.com';
  const invalidPassword = 'wrongpass';
  const invalidEmailFormat = 'invalid-email';

  test('1.1.1 - Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await loginPage.assertSuccessfulLogin();
  });

  test('1.1.2 - Login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(invalidEmail, invalidPassword);
    await loginPage.assertError('Invalid credentials'); // Adjust expected error
  });

  test('1.1.3 - Login with blank inputs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.submitBlankForm();
    await loginPage.assertInvalidInput(loginPage.emailInput);
    await loginPage.assertInvalidInput(loginPage.passwordInput);
    // Or check for validation errors
  });

  test('1.1.4 - Login with invalid email, valid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill(invalidEmailFormat);
    await loginPage.login('', validPassword); // Fill password in login but since it fills again, adjust
    await loginPage.assertError('Invalid email'); // Adjust expected
  });

  test('1.1.5 - Login with valid email, blank password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill(validEmail);
    await loginPage.submitBlankForm();
    await loginPage.assertInvalidInput(loginPage.passwordInput);
  });

  test('1.2.1 - Verify logout functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await loginPage.assertSuccessfulLogin();
    // Logout: Assume navigation to dashboard happened; use raw for now or create HeaderPage
    await page.click('button:has-text("Logout")'); // Adjust selector
    await expect(page).toHaveURL('https://devcore.bechakeena.com');
  });

  test('1.2.2 - Check password masking', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.assertPasswordMasked(); // Check before fill or after
    // Fill to verify
    const passwordInput = page.locator('input[placeholder="Password"]');
    await passwordInput.fill('pa$$word');
    await loginPage.assertPasswordMasked();
  });

  test('1.2.3 - Check forgot password (if applicable)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickForgotPassword();
    await page.fill('input[placeholder="Email for reset"]', validEmail); // Adjust; add to POM if always used
    await page.click('button:has-text("Send Reset")'); // Adjust
    await expect(page.locator('text=Reset email sent')).toBeVisible(); // Adjust
  });

  test('1.2.4 - Check session timeout behavior', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await loginPage.assertSuccessfulLogin();
    await page.waitForTimeout(300000); // Simulate timeout
    // Check redirect
    await expect(page).toHaveURL('https://devcore.bechakeena.com');
  });
});
