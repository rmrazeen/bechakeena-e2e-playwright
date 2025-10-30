// tests/Checking_form-fill.spec.js

const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SupplierPage } = require('../pages/supplierPage');

test('Click Action dropdown for given supplier', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const supplierPage = new SupplierPage(page);

  // Step 1: Login first
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'pa$$word');
  await loginPage.assertSuccessfulLogin(/.*admin/);

  // Step 2: Go to supplier list
 
   await supplierPage.goto();

  // Click by Name
  //await supplierPage.clickActionByName('Malcolm Powers');

  // Click by Email
  await supplierPage.clickActionByMail('shariful.sqa@gmail.com');
  await supplierPage.clickEditButton()
  await page.waitForTimeout(3000);
  
}

);
