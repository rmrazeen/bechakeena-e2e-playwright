// pages/login.page.js
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // adjust locators to your app (use developer tools to confirm)
    this.email = page.getByPlaceholder('Email')  // or use getByLabel if exists
    this.password = page.getByPlaceholder('Password')
    this.loginBtn = page.getByRole('button', { name: /login/i })
    this.logoutBtn = page.getByRole('button', { name: /logout/i })
    this.emailError = page.getByText('Please enter a valid email address.')
    this.passwordError = page.getByText('Please enter a password.')
    this.dangerError = page.locator("//p[normalize-space(text())='Incorrect email or password']") // error message after failed login at top of form
    
  }

  async goto() {
    await this.page.goto('https://devcore.bechakeena.com');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
    // playwright auto-waits by default for navigations and network idle
  }

  async logout() {
    // If there's a profile menu + logout button, adjust accordingly
    await this.logoutBtn.click();
  }

  async getEmailError() {
    return this.emailError;
  }

  async getPasswordError() {
    return this.passwordError;
  }

  async getErrorMessage() {
    await this.page.expect(this.dangerError).toBeVisible();
    return this.dangerError;
  }

  async passwordIsMasked() {
    return (await this.password.getAttribute('type')) === 'password';
  }
}

module.exports = { LoginPage };
