const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.totalBuyersKPI = page.locator("(//span[@class='info-box-number'])[1]");
    this.totalSuppliersKPI = page.locator("(//span[@class='info-box-number'])[2]");
    this.totalOrdersKPI = page.locator("(//span[@class='info-box-number'])[3]");
    this.totalRequestionsKPI = page.locator("(//span[@class='info-box-number'])[4]");

  }

  async goto(baseUrl='https://devcore.bechakeena.com') {
    await this.page.goto(`${baseUrl}/dashboard`); 
  }

  async beforeSupplierKpi() {
    const beforeChangeValue = await this.totalSuppliersKPI.innerText();;
    return beforeChangeValue;
  }

  async afterSupplierKpi() {
    const afterChangeValue = await this.totalSuppliersKPI.innerText();
    return afterChangeValue;
  }
    // Additional checks if needed
  

    async validateSummaries() {
    await expect(this.summaryList).toBeVisible();
    await expect(this.summaryList.locator('li')).toHaveCount.greaterThan(0);
  }

}

module.exports = { DashboardPage };
