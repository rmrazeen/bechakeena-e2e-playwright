const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.totalBuyersKPI = page.locator("(//span[@class='info-box-number'])[1]");
    this.totalSuppliersKPI = page.locator("(//span[@class='info-box-number'])[2]");
    this.totalOrdersKPI = page.locator("(//span[@class='info-box-number'])[3]");
    this.totalRequestionsKPI = page.locator("(//span[@class='info-box-number'])[4]");
  }

  /** Navigate to Dashboard Page */
  async goto(baseUrl = 'https://devcore.bechakeena.com') {
    await this.page.goto(`${baseUrl}/admin`);
  }

  /** Capture Supplier KPI before change */
  async getBeforeSupplierKpi() {
    const beforeValue = await this.totalSuppliersKPI.innerText();
    return parseInt(beforeValue.replace(/\D/g, ''), 10);
  }

  /** Capture Supplier KPI after change */
  async getAfterSupplierKpi() {
    const afterValue = await this.totalSuppliersKPI.innerText();
    return parseInt(afterValue.replace(/\D/g, ''), 10);
  }

  /** Validate KPI summary boxes are visible and contain data */
  async validateSummaries() {
    await expect(this.totalBuyersKPI).toBeVisible();
    await expect(this.totalSuppliersKPI).toBeVisible();
    await expect(this.totalOrdersKPI).toBeVisible();
    await expect(this.totalRequestionsKPI).toBeVisible();

    // Optional: Ensure all have numeric values
    const buyers = await this.totalBuyersKPI.innerText();
    const suppliers = await this.totalSuppliersKPI.innerText();
    const orders = await this.totalOrdersKPI.innerText();
    const reqs = await this.totalRequestionsKPI.innerText();

    expect(parseInt(buyers.replace(/\D/g, ''), 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(suppliers.replace(/\D/g, ''), 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(orders.replace(/\D/g, ''), 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(reqs.replace(/\D/g, ''), 10)).toBeGreaterThanOrEqual(0);
  }
}

module.exports = { DashboardPage };
