// tests/supplier-count-kpi.spec.js

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { SupplierPage } = require('../pages/supplierPage');

test('Verify Supplier KPI increases after adding a supplier', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const supplierPage = new SupplierPage(page);

  // Step 1️⃣: Go to login page and login
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'pa$$word'); // change creds if needed
  await loginPage.assertSuccessfulLogin(/.*admin/);
  console.log('✅ Logged in successfully');

  // Step 2️⃣: Go to dashboard and capture KPI before change
  await dashboardPage.goto();
  const beforeKPI = await dashboardPage.getBeforeSupplierKpi();
  console.log(`🧮 Suppliers before adding: ${beforeKPI}`);

  // Step 3️⃣: Go to Supplier Page and add new supplier
  await supplierPage.goto();
  await supplierPage.addSupplierButton();
  await supplierPage.randomSupplier();
  await supplierPage.uploadSupplierImage();
  await page.waitForTimeout(3000);
  await supplierPage.supplierCreateButton();
  await supplierPage.toatsMessageCheck();
  
  await page.waitForTimeout(3000);

  // Step 4️⃣: Go back to dashboard and capture KPI after change
  await dashboardPage.goto();
  const afterKPI = await dashboardPage.getAfterSupplierKpi();
  console.log(`✅ Suppliers after adding: ${afterKPI}`);

  // Step 5️⃣: Assert KPI increased by 1
  expect(afterKPI).toBe(beforeKPI + 1);
});
