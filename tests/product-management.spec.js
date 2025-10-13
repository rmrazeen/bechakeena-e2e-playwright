const { test, expect } = require('@playwright/test');

test.describe('Product Management', () => {
  const adminUrl = 'https://devcore.bechakeena.com';
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';

  test.beforeEach(async ({ page }) => {
    await page.goto(adminUrl);
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/.*dashboard/);
    // Navigate to products
    await page.click('text=Products'); // Adjust navigation selector
  });

  test('3.1.1 - Product creation', async ({ page }) => {
    await page.click('button:has-text("Add Product")'); // Adjust
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('input[name="description"]', 'Test Description');
    await page.fill('input[name="price"]', '99.99');
    await page.selectOption('select[name="category"]', 'Electronics'); // Adjust
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Product created successfully')).toBeVisible(); // Adjust
  });

  test('3.1.2 - Product update', async ({ page }) => {
    await page.click('text=Edit'); // For existing product, adjust locator
    await page.fill('input[name="name"]', 'Updated Product');
    await page.click('button:has-text("Update")');
    await expect(page.locator('text=Product updated successfully')).toBeVisible();
  });

  test('3.1.3 - Product deletion', async ({ page }) => {
    await page.click('text=Delete'); // For existing product
    await page.click('button:has-text("Confirm")'); // Confirmation dialog
    await expect(page.locator('text=Product deleted successfully')).toBeVisible();
  });

  test('3.2.1 - Mandatory field validation', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Name is required')).toBeVisible(); // Adjust for error
    // Check price, description, etc.
  });

  test('3.2.2 - Error handling on creation/update', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="price"]', 'invalid-price');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Invalid price format')).toBeVisible();
  });

  test('3.2.3 - Image uploads', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.setInputFiles('input[type="file"]', 'path/to/test-image.jpg'); // Adjust for valid image path
    await page.click('button:has-text("Upload")');
    await expect(page.locator('img[src*="test-image"]')).toBeVisible(); // Verify image
  });

  test('3.3.1 - Category/brand linkage', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.selectOption('select[name="category"]', 'Electronics');
    await page.selectOption('select[name="brand"]', 'Samsung'); // Ensure linked
    await page.click('button:has-text("Create")');
    // Verify in list or detail
  });

  test('3.3.2 - Variant management', async ({ page }) => {
    await page.click('text=Add Variant'); // Adjust
    await page.fill('input[name="size"]', 'Large');
    await page.fill('input[name="color"]', 'Red');
    await page.fill('input[name="sku"]', 'TEST-SKU');
    await page.click('button:has-text("Add Variant")');
    await expect(page.locator('.variant-list li')).toContainText('Large, Red');
  });

  test('3.3.3 - Negative testing: invalid input', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="name"]', 'a'.repeat(256)); // Oversized name
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Name too long')).toBeVisible();
  });

  test('3.3.4 - Negative testing: oversized image', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.setInputFiles('input[type="file"]', 'path/to/large-image.jpg'); // Assume large file
    await page.click('button:has-text("Upload")');
    await expect(page.locator('text=Image too large')).toBeVisible();
  });

  test('3.3.5 - Negative testing: duplicate entry', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="name"]', 'Existing Product Name'); // Assume duplicate
    await page.fill('input[name="sku"]', 'EXISTING-SKU');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=SKU already exists')).toBeVisible();
  });
});
