const { BasePage } = require('./BasePage');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[placeholder="Email"]'); // Adjust if needed
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.signInButton = page.locator('button:has-text("Sign in")');
    this.forgotPasswordLink = page.locator('text=Forgot password?');
    this.errorMessage = page.locator('text=Invalid credentials'); // Adjust for specific errors
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('https://devcore.bechakeena.com');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async submitBlankForm() {
    await this.signInButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async assertSuccessfulLogin(expectedUrl = /.*dashboard/) {
    await this.page.waitForURL(expectedUrl);
  }

  async assertError(expectedError = 'Invalid credentials') {
    await this.page.locator(`text=${expectedError}`).toBeVisible();
  }

  async assertInvalidInput(inputLocator, invalid = 'true') {
    await expect(inputLocator).toHaveAttribute('aria-invalid', invalid);
  }

  async assertPasswordMasked() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }
}

module.exports = { LoginPage };
