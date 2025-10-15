// tests/supplier-action.spec.js

const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SupplierPage } = require('../pages/SupplierPage');

test('Click Action dropdown for given supplier', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const supplierPage = new SupplierPage(page);

  // Step 1: Login first
  await loginPage.goto();
  await loginPage.login('admin@bechakena.com', 'Admin@123');
  await loginPage.assertSuccessfulLogin(/.*admin/);

  // Step 2: Go to supplier list
  await supplierPage.goto();

  // Step 3: Click action for specific supplier
  const supplierName = 'Malcolm Powers'; // ← pass this dynamically if you want
  await supplierPage.clickActionByName(supplierName);

  // (Optional) Verify that the dropdown opened
  await page.waitForSelector('.dropdown-menu.show');
});
