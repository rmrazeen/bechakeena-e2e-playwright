const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const path = require('path');
import { faker } from '@faker-js/faker';

class SupplierPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.supplierAddButton = page.locator("//div[@class='text-right']//a[1]");
    this.supplierNameInput = page.locator("#fullName");
    this.supplierEmailInput = page.locator("#email");
    this.supplierPhoneInput = page.locator("(//input[@class='form-control'])[3]");
    this.supplierAddressInput = page.locator("#address"); // Assuming an ID or suitable locator for address
    this.supplierSubmitButton = page.locator("(//button[@type='submit'])[1]");
    this.handlechooseFile = page.locator("#avatar");
    this.toatsMessage = page.locator('//div[@class="toast-message"]');
    this.editButton =  page.locator('//div[contains(@class,"dropdown-menu dropdown-menu-right show")]//a[contains(@class,"dropdown-item")][normalize-space()="Edit"]');
    this.deleteButton = page.locator('//div[contains(@class,"dropdown-menu dropdown-menu-right show")]//button[contains(@class,"dropdown-item")][normalize-space()="Delete"]');
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async goto(baseUrl = 'https://devcore.bechakeena.com') {
    await this.page.goto(`${baseUrl}/admin/users/suppliers/index`);
    await this.page.waitForLoadState('networkidle');
  }

  async validateSupplierPage() {
    await expect(this.page).toHaveURL(/.*suppliers/);
  }

  async addSupplierButton() {
    await this.supplierAddButton.click();
  }

  async fillSupplierName(name) {
    await this.supplierNameInput.fill(name);
  }

  async fillSupplierEmail(email) {
    await this.supplierEmailInput.fill(email);
  }

  async fillSupplierPhone(phone) {
    await this.supplierPhoneInput.fill(phone);
  }

  async fillSupplierAddress(address) {
    await this.supplierAddressInput.fill(address);
  }

  async randomSupplier() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const phoneNumber = faker.phone.number('###-###-####');
    await this.fillSupplierName(fullName);
    await this.fillSupplierEmail(email);
    await this.fillSupplierPhone(phoneNumber);
    
  }

  async supplierCreateButton() {
    await this.supplierSubmitButton.click();
  }
  
async toatsMessageCheck() {
  const expectedText = 'Supplier created successfully';
  const actualText = await this.toatsMessage.innerText();
  await expect(this.toatsMessage).toBeVisible();
  await expect(this.toatsMessage).toContainText(expectedText);
  console.log(`🎉Message: ${actualText}`);
}


// loop through table rows and click action button
/**
 * Generic reusable method to click the Action button based on column and search value
 * @param {string} searchValue - The text to search (name, email, etc.)
 * @param {number} columnIndex - The column number (1-based index, e.g., 2 for name, 4 for email)
 */
async clickActionByColumn(searchValue, columnIndex) {
  // Normalize input for case-insensitive matching
  const searchLower = searchValue.toLowerCase();

  // Wait until table rows are visible
  await this.page.waitForSelector('//table//tbody//tr');
  const rows = this.page.locator('//table//tbody//tr');
  const rowCount = await rows.count();

  console.log(`🔍 Searching for "${searchValue}" in column ${columnIndex}`);
  console.log(`📊 Total rows found: ${rowCount}`);

  for (let i = 1; i <= rowCount; i++) {
    const cellLocator = this.page.locator(`//table//tbody//tr[${i}]//td[${columnIndex}]`);
    const cellText = await cellLocator.innerText();
    const cellLower = cellText.trim().toLowerCase();

    // Partial match check
    if (cellLower.includes(searchLower)) {
      console.log(`✅ Found match at row ${i} → "${cellText.trim()}"`);

      const actionButton = this.page.locator(
        `//table//tbody//tr[${i}]//button[contains(text(), 'Action')]`
      );
      
      await actionButton.waitFor({ state: 'visible' });
      await actionButton.click();

      console.log('🎉 Action button clicked');

      return i; // Return row index for reference
    }
  }

  throw new Error(`❌ "${searchValue}" not found in column ${columnIndex}`);
}

/**
 * Click Action dropdown using supplier Name
 * @param {string} name - The supplier name to find
 */
async clickActionByName(name) {
  return await this.clickActionByColumn(name, 2); // Assuming Name is in 3rd column
}

/**
 * Click Action dropdown using supplier Email
 * @param {string} mail - The supplier email to find
 */
async clickActionByMail(mail) {
  return await this.clickActionByColumn(mail, 3); // Assuming Email is in 4th column
}

/**
 * Click Action dropdown using supplier Email
 * @param {string} phone - The supplier email to find
 */
async clickActionByPhone(phone) {
  return await this.clickActionByColumn(phone, 4); // if phone in 5th column
}

async clickEditButton() {
  expect(this.editButton).toBeVisible();
  await this.editButton.click();
}
 async clickDeleteButton() {
      expect(this.deleteButton).toBeVisible();
      await this.deleteButton.click();
 }


  async uploadSupplierImage() {
    const filePath = path.join("F:/Task Qtec/img/Supplier.jpg");
    await this.handlechooseFile.setInputFiles(filePath);
    
  }
}




module.exports = { SupplierPage };
