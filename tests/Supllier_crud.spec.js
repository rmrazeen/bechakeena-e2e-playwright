// tests/Checking_form-fill.spec.js

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SupplierPage } = require('../pages/supplierPage');

const { faker } = require('@faker-js/faker');

test('Perform CRUD operations on a supplier', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const supplierPage = new SupplierPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'pa$$word');
  await loginPage.assertSuccessfulLogin(/.*admin/);

  // Step 2: Add a new supplier
  await supplierPage.goto();
  await supplierPage.addSupplierButton();

  const newSupplierName = faker.person.fullName();
  const newSupplierEmail = faker.internet.email();
  const newSupplierPhone = faker.phone.number('###-###-####');

  await supplierPage.fillSupplierName(newSupplierName);
  await supplierPage.fillSupplierEmail(newSupplierEmail);
  await supplierPage.fillSupplierPhone(newSupplierPhone);
  await supplierPage.supplierCreateButton();
  await supplierPage.toatsMessageCheck('Supplier created successfully');

  // Step 3: Verify the new supplier is added and extract info for update
  await supplierPage.goto(); // Go back to the list to ensure data is refreshed
  await supplierPage.clickActionByMail(newSupplierEmail);
  await supplierPage.clickEditButton();
  await page.waitForTimeout(3000); // Wait for the form to load

  const extractedName = await supplierPage.supplierNameInput.inputValue();
  const extractedEmail = await supplierPage.supplierEmailInput.inputValue();
  const extractedPhone = await supplierPage.supplierPhoneInput.inputValue();

  console.log('Newly Created Supplier Info:', { extractedName, extractedEmail, extractedPhone });

  // Step 4: Update the newly added supplier
  const updatedSupplierName = newSupplierName + ' Updated';
  await supplierPage.fillSupplierName(updatedSupplierName);
  await supplierPage.updateButton.click();
  await supplierPage.toatsMessageCheck('Supplier updated successfully');

  // Step 5: Verify the update
  await supplierPage.goto();
  await supplierPage.clickActionByMail(newSupplierEmail); // Still using original email to find
  await supplierPage.clickEditButton();
  await page.waitForTimeout(3000);

  const verifiedName = await supplierPage.supplierNameInput.inputValue();
  expect(verifiedName).toBe(updatedSupplierName);
  console.log('Verified Updated Name:', verifiedName);

  // Step 6: Delete the supplier
  await supplierPage.goto();
  await supplierPage.clickActionByMail(newSupplierEmail);
  await supplierPage.clickDeleteButton();
  await supplierPage.deleteConfirmButton.click(); // Click the confirm delete button in the modal
  await supplierPage.toatsMessageCheck('Supplier deleted');

  // Step 7: Verify the supplier is deleted (optional: search for it and assert not found)
  // This part might require a specific assertion that the supplier is no longer in the list.
  // For now, the toast message is sufficient.
});
