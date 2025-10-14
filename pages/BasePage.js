class BasePage {
  constructor(page) {
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

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = { BasePage };
