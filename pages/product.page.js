// pages/product.page.js
import { Page, expect } from '@playwright/test';

export class ProductPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.productsMenuItem = page.locator('text=/Products|Products/i').first();
    this.addProductButton = page.locator('button:has-text("Add Product"), button:has-text("New Product"), .btn-add-product');
    this.productsTable = page.locator('.products-table, .product-list, table');
    this.productRows = page.locator('tr:has-text("product"), .product-row');
    
    // Product form elements
    this.productNameInput = page.locator('input[name="name"], input[placeholder*="name"], input[placeholder*="Name"]');
    this.productDescriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="description"]');
    this.productPriceInput = page.locator('input[name="price"], input[placeholder*="price"], input[placeholder*="Price"]');
    this.productSKUInput = page.locator('input[name="sku"], input[placeholder*="sku"], input[placeholder*="SKU"]');
    this.productCategorySelect = page.locator('select[name="category"], select[placeholder*="category"]');
    this.productBrandSelect = page.locator('select[name="brand"], select[placeholder*="brand"]');
    this.productQuantityInput = page.locator('input[name="quantity"], input[placeholder*="quantity"]');
    this.productStatusToggle = page.locator('input[type="checkbox"][name="status"], .toggle-switch');
    
    // Image upload
    this.imageUploadInput = page.locator('input[type="file"][accept*="image"]');
    this.imagePreview = page.locator('.image-preview, .product-image');
    this.removeImageButton = page.locator('button:has-text("Remove"), .remove-image');
    
    // Variants
    this.addVariantButton = page.locator('button:has-text("Add Variant"), .add-variant');
    this.variantNameInput = page.locator('input[name="variant_name"]');
    this.variantPriceInput = page.locator('input[name="variant_price"]');
    this.variantSKUInput = page.locator('input[name="variant_sku"]');
    this.variantQuantityInput = page.locator('input[name="variant_quantity"]');
    
    // Actions
    this.saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.editButton = page.locator('button:has-text("Edit"), .btn-edit');
    this.deleteButton = page.locator('button:has-text("Delete"), .btn-delete');
    this.confirmDeleteButton = page.locator('button:has-text("Confirm Delete"), .confirm-delete');
    
    // Validation errors
    this.validationErrors = page.locator('.error-message, .invalid-feedback, .validation-error');
    this.requiredFieldErrors = page.locator(':invalid, .required-field');
    
    // Search and filters
    this.searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    this.categoryFilter = page.locator('select[placeholder*="category"]');
    this.brandFilter = page.locator('select[placeholder*="brand"]');
    this.statusFilter = page.locator('select[placeholder*="status"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply"), .apply-filters');
    
    // Pagination
    this.pagination = page.locator('.pagination');
    this.nextPageButton = page.locator('button:has-text("Next"), .next-page');
    this.prevPageButton = page.locator('button:has-text("Previous"), .prev-page');
    
    // Toast notifications
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"][class*="success"]');
    this.errorToast = page.locator('.toast-error, .alert-error, [role="alert"][class*="error"]');
  }

  async navigateToProducts() {
    await this.productsMenuItem.click();
    await expect(this.productsTable).toBeVisible({ timeout: 10000 });
  }

  async clickAddProduct() {
    await this.addProductButton.click();
    await expect(this.productNameInput).toBeVisible();
  }

  async fillProductForm(productData) {
    if (productData.name) await this.productNameInput.fill(productData.name);
    if (productData.description) await this.productDescriptionInput.fill(productData.description);
    if (productData.price) await this.productPriceInput.fill(productData.price.toString());
    if (productData.sku) await this.productSKUInput.fill(productData.sku);
    if (productData.category) await this.productCategorySelect.selectOption({ label: productData.category });
    if (productData.brand) await this.productBrandSelect.selectOption({ label: productData.brand });
    if (productData.quantity !== undefined) await this.productQuantityInput.fill(productData.quantity.toString());
    if (productData.status !== undefined) {
      if (productData.status) {
        await this.productStatusToggle.check();
      } else {
        await this.productStatusToggle.uncheck();
      }
    }
  }

  async uploadProductImage(filePath) {
    if (this.imageUploadInput.isVisible()) {
      await this.imageUploadInput.setInputFiles(filePath);
      await expect(this.imagePreview).toBeVisible();
    }
  }

  async addVariant(variantData) {
    await this.addVariantButton.click();
    await expect(this.variantNameInput).toBeVisible();
    
    if (variantData.name) await this.variantNameInput.fill(variantData.name);
    if (variantData.price) await this.variantPriceInput.fill(variantData.price.toString());
    if (variantData.sku) await this.variantSKUInput.fill(variantData.sku);
    if (variantData.quantity !== undefined) await this.variantQuantityInput.fill(variantData.quantity.toString());
  }

  async saveProduct() {
    await this.saveButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async cancelProductCreation() {
    await this.cancelButton.click();
  }

  async editProduct(productName) {
    const productRow = this.productsTable.locator(`tr:has-text("${productName}")`).first();
    const editButton = productRow.locator('button:has-text("Edit")');
    await editButton.click();
    await expect(this.productNameInput).toBeVisible();
  }

  async deleteProduct(productName) {
    const productRow = this.productsTable.locator(`tr:has-text("${productName}")`).first();
    const deleteButton = productRow.locator('button:has-text("Delete")');
    await deleteButton.click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async getProductList() {
    const products = [];
    const productRows = await this.productRows.all();
    
    for (const row of productRows) {
      const name = await row.locator('.product-name, td:first-child').textContent();
      const sku = await row.locator('.product-sku').textContent();
      const price = await row.locator('.product-price').textContent();
      const category = await row.locator('.product-category').textContent();
      const status = await row.locator('.product-status').textContent();
      
      products.push({
        name: name?.trim(),
        sku: sku?.trim(),
        price: price?.trim(),
        category: category?.trim(),
        status: status?.trim()
      });
    }
    
    return products;
  }

  async searchProduct(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.applyFiltersButton.click();
    await expect(this.productsTable).toBeVisible();
  }

  async filterByCategory(category) {
    await this.categoryFilter.selectOption({ label: category });
    await this.applyFiltersButton.click();
    await expect(this.productsTable).toBeVisible();
  }

  async filterByBrand(brand) {
    await this.brandFilter.selectOption({ label: brand });
    await this.applyFiltersButton.click();
    await expect(this.productsTable).toBeVisible();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption({ label: status });
    await this.applyFiltersButton.click();
    await expect(this.productsTable).toBeVisible();
  }

  async getValidationErrors() {
    const errors = [];
    const errorElements = await this.validationErrors.all();
    
    for (const errorElement of errorElements) {
      const errorText = await errorElement.textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }
    
    return errors;
  }

  async getRequiredFieldErrors() {
    const errors = [];
    const requiredElements = await this.requiredFieldErrors.all();
    
    for (const element of requiredElements) {
      errors.push(await element.textContent());
    }
    
    return errors;
  }

  async validateFormFields() {
    const errors = await this.getValidationErrors();
    return errors;
  }

  async isProductSaved(productName) {
    const productRow = this.productsTable.locator(`tr:has-text("${productName}")`);
    return await productRow.isVisible();
  }

  async getProductByName(productName) {
    const productRow = this.productsTable.locator(`tr:has-text("${productName}")`).first();
    const name = await productRow.locator('.product-name, td:first-child').textContent();
    const sku = await productRow.locator('.product-sku').textContent();
    const price = await productRow.locator('.product-price').textContent();
    const category = await productRow.locator('.product-category').textContent();
    const status = await productRow.locator('.product-status').textContent();
    
    return {
      name: name?.trim(),
      sku: sku?.trim(),
      price: price?.trim(),
      category: category?.trim(),
      status: status?.trim()
    };
  }

  // Test specific methods
  async createProductWithInvalidData(invalidData) {
    await this.clickAddProduct();
    await this.fillProductForm(invalidData);
    await this.saveProduct();
    return await this.getValidationErrors();
  }

  async createProductWithLargeImage(imagePath) {
    await this.clickAddProduct();
    await this.fillProductForm({ name: 'Test Product', price: '10' });
    await this.uploadProductImage(imagePath);
    await this.saveProduct();
  }

  async createDuplicateProduct(productData) {
    await this.clickAddProduct();
    await this.fillProductForm(productData);
    await this.saveProduct();
    
    // Try to create the same product again
    await this.clickAddProduct();
    await this.fillProductForm(productData);
    await this.saveProduct();
    
    return await this.getValidationErrors();
  }

  async waitForProductsTable() {
    await expect(this.productsTable).toBeVisible({ timeout: 10000 });
  }
}
