const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator("//button[@type='submit']");
    this.rememberMeCheckbox = page.locator("//label[normalize-space(text())='Remember me']");
    this.errorMessage = page.locator("//p[@class='form-des']/following-sibling::p[1]");
    this.emailErrorMessage = page.getByText('Please enter a valid email address.');
    this.passErrorMessage = page.getByText('Please enter a password.');
    this.profileDropdown = page.locator("//i[@class='fas fa-user-circle']");
    this.logoutButton = page.locator("//div[@class='dropdown-divider']/following-sibling::a[1]");
  }

  /** Navigates to login page */
  async goto() {
    await this.navigateTo('https://devcore.bechakeena.com');
  }

  /** Performs login action */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /** Submit blank form */
  async submitBlankForm() {
    await this.signInButton.click();
  }

  /** Fill email field */
  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  /** Fill password field */
  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  /** Click Sign In button */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /** Get current URL */
  async currentUrl() {
    return this.page.url();
  }

  /** Assert successful login by checking expected URL */
  async assertSuccessfulLogin(expectedUrl = /.*admin/) {
    await this.page.waitForURL(expectedUrl);
  }

  /** Assert email validation error */
  async assertEmailError(message = 'Please enter a valid email address.') {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  /** Assert password validation error */
  async assertPassError(message = 'Please enter a password.') {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  /** Assert invalid field input */
  async assertInvalidInput(inputLocator, invalid = 'true') {
    await expect(inputLocator).toHaveAttribute('aria-invalid', invalid);
  }

  /** Assert password is masked */
  async assertPasswordMasked() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  /** Logout from dashboard */
  async logout() {
    await this.profileDropdown.click();
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
