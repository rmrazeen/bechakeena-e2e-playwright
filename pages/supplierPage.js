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
    this.page.locator(`//table//tr[td[normalize-space()="${name}"]]`);

  }

  async goto(baseUrl = 'https://devcore.bechakeena.com') {
    await this.page.goto(`${baseUrl}/admin/users/suppliers/index`);
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

async clickActionByName(name) {
  // Locate the table row containing the supplier name
  

  // Wait until row is visible
  await row.waitFor({ state: 'visible' });

  // Locate the Action dropdown inside that row
  const actionButton = row.locator('.dropdown-toggle, button:has-text("Action")');

  // Click it
  await actionButton.click();
}


  async uploadSupplierImage() {
    const filePath = path.join("F:/Task Qtec/img/Supplier.jpg");
    await this.handlechooseFile.setInputFiles(filePath);
    
  }
}

module.exports = { SupplierPage };
