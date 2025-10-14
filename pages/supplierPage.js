const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
import { faker } from '@faker-js/faker';
import path from 'path';

class SupplierPage {

  constructor(page) {
    this.page = page;
    this.supplierAddButton = page.locator("//div[@class='text-right']//a[1]");
    this.supplierNameInput = page.locator("#name");
    this.supplierEmailInput = page.locator("#email");
    this.supplierPhoneInput = page.locator("#phone");
    this.supplierAddressInput = page.locator("#address");
    this.supplierSubmitButton = page.locator("//button[@type='submit']");
    this.chooseFileButton = page.locator("#avatar");
  }

  async goto(baseUrl='https://devcore.bechakeena.com') {
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
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
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
    // Navigate to the page where file upload happens (if different)
    // This assumes the file upload button is already visible
    
    // Use Promise.all to wait for both the click and the filechooser event
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.chooseFileButton.click()
    ]);

    // Provide the path to the file you want to upload
    const filePath = path.join(__dirname, '..', 'img', imageFileName);

    // Set the files in the file chooser
    await fileChooser.setFiles(filePath);

    // Wait for upload to complete (if there's an upload button or confirmation)
    // You may need to add additional code here if there's an upload button to click
  }
}

module.exports = { SupplierPage };
