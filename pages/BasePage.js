const { Page } = require('@playwright/test');

class BasePage extends Page {
  constructor(page) {
    super();
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async route(urlPattern, handler) {
    await this.page.route(urlPattern, handler);
  }
}

module.exports = { BasePage };
