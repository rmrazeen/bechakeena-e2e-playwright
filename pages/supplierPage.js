const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const path = require('path');

class SupplierPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.supplierAddButton = page.locator("//div[@class='text-right']//a[1]");
    this.supplierNameInput = page.locator("#fullName");
    this.supplierEmailInput = page.locator("#email");
    this.supplierPhoneInput = page.locator("(//input[@class='form-control'])[3]");
    this.supplierSubmitButton = page.locator("(//button[@type='submit'])[1]");
    this.chooseFileButton = page.locator("#avatar");
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
    // ✅ dynamically import faker (works with CommonJS)
    const { faker } = await import('@faker-js/faker');

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const phoneNumber = faker.phone.number('###-###-####');
    const address = faker.location.streetAddress();

    await this.fillSupplierName(fullName);
    await this.fillSupplierEmail(email);
    await this.fillSupplierPhone(phoneNumber);
    await this.fillSupplierAddress(address);
  }

  async supplierCreateButton() {
    await this.supplierSubmitButton.click();
  }

  async uploadSupplierImage(imageFileName = 'Supplier.jpg') {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.chooseFileButton.click(),
    ]);

    const filePath = path.join(__dirname, '..', 'img', imageFileName);
    await fileChooser.setFiles(filePath);
  }
}

module.exports = { SupplierPage };
