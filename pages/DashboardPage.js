const { BasePage } = require('./BasePage');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.totalOrdersKPI = page.locator('[data-testid="total-orders"]');
    this.chartElement = page.locator('canvas, .chart-container');
    this.summaryList = page.locator('.summary-list');
    this.totalProductsKPI = page.locator('[data-testid="total-products"]');
  }

  async goto() {
    await this.page.goto('/dashboard'); // Assume direct or from login redirect
  }

  async validateKPIs() {
    await expect(this.totalOrdersKPI).toBeVisible();
    await expect(this.totalOrdersKPI).toContainText(/[0-9]+/); // Numeric value
  }

  async validateCharts() {
    await expect(this.chartElement).toBeVisible();
    // Additional checks if needed
  }

  async validateSummaries() {
    await expect(this.summaryList).toBeVisible();
    await expect(this.summaryList.locator('li')).toHaveCount.greaterThan(0);
  }

  async performCRUDAndRefresh() {
    // Navigate to add product (assume navigation or URL)
    await this.page.goto('/products/new');
    await this.page.fill('input[name="name"]', 'Test Product');
    await this.page.fill('input[name="price"]', '10.00');
    await this.page.click('button:has-text("Create")');
    // Back to dashboard
    await this.goto();
    await this.page.waitForTimeout(2000); // Wait refresh
    await expect(this.totalProductsKPI).toContainText(/[0-9]+/);
  }
}

module.exports = { DashboardPage };
