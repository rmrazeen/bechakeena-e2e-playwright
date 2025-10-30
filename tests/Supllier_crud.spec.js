// tests/Checking_form-fill.spec.js

const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SupplierPage } = require('../pages/supplierPage');

test('Extract supplier info, update, and verify success message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const supplierPage = new SupplierPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'pa$$word');
  await loginPage.assertSuccessfulLogin(/.*admin/);

  // Step 2: Go to supplier list and click edit for a specific supplier
  await supplierPage.goto();
  await supplierPage.clickActionByMail('update_Wilderman@yahoo.com'); // Using the email from the screenshot
  await supplierPage.clickEditButton();
  await page.waitForTimeout(3000); // Wait for the form to load

  // Step 3: Extract current name, email, and phone number
  const name = await supplierPage.supplierNameInput.inputValue();
  const email = await supplierPage.supplierEmailInput.inputValue();
  const phone = await supplierPage.supplierPhoneInput.inputValue();

  const supplierInfo = { name, email, phone };
  console.log('Extracted Supplier Info:', supplierInfo);

  // Step 4: Update the supplier's name
  const newName = 'Aurelie Wilderman Updated';
  await supplierPage.fillSupplierName(newName);

  // Step 5: Click the update button
  await supplierPage.updateButton.click();

  // Step 6: Verify the success message
  await supplierPage.toatsMessageCheck('Supplier updated successfully');
  
});
