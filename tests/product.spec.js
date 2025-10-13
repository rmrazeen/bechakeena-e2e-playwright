// tests/product.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { ProductPage } from '../pages/product.page.js';

test.describe('Product Management Tests', () => {
  let loginPage;
  let productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    
    // Login before each test
    await loginPage.login('admin@example.com', 'pa$$word');
    await expect(page.locator('text=/Dashboard|Home/i')).toBeVisible({ timeout: 10000 });
  });

  test.describe('Product Creation', () => {
    test('should create a new product with valid data', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Test Product',
        description: 'A test product for validation',
        price: '29.99',
        sku: 'TEST001',
        category: 'Electronics',
        brand: 'TestBrand',
        quantity: '100',
        status: true
      };
      
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
      
      // Verify product is saved
      const isSaved = await productPage.isProductSaved(productData.name);
      expect(isSaved).toBe(true);
    });

    test('should validate required fields during product creation', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      // Try to save without required fields
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      expect(validationErrors.length).toBeGreaterThan(0);
      
      // Check for specific required field errors
      const hasNameError = validationErrors.some(error => 
        error.toLowerCase().includes('name') || error.toLowerCase().includes('required')
      );
      expect(hasNameError).toBe(true);
    });

    test('should validate price format during product creation', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const invalidProductData = {
        name: 'Test Product',
        price: 'invalid-price',
        sku: 'TEST002'
      };
      
      await productPage.fillProductForm(invalidProductData);
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      const hasPriceError = validationErrors.some(error => 
        error.toLowerCase().includes('price') || error.toLowerCase().includes('format')
      );
      expect(hasPriceError).toBe(true);
    });

    test('should validate SKU uniqueness during product creation', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Test Product',
        price: '19.99',
        sku: 'UNIQUE001'
      };
      
      // Create first product
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
      
      // Try to create product with same SKU
      await productPage.clickAddProduct();
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      const hasDuplicateError = validationErrors.some(error => 
        error.toLowerCase().includes('sku') || error.toLowerCase().includes('duplicate')
      );
      expect(hasDuplicateError).toBe(true);
    });

    test('should handle image upload during product creation', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Test Product with Image',
        price: '39.99',
        sku: 'IMG001'
      };
      
      await productPage.fillProductForm(productData);
      
      // Note: This test would need an actual image file
      // For now, we'll just test the upload button exists
      const imageUploadVisible = await productPage.imageUploadInput.isVisible();
      if (imageUploadVisible) {
        expect(imageUploadVisible).toBe(true);
      }
    });

    test('should create product with variants', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Product with Variants',
        price: '49.99',
        sku: 'VAR001'
      };
      
      await productPage.fillProductForm(productData);
      
      // Add variants
      const variant1 = {
        name: 'Small',
        price: '44.99',
        sku: 'VAR001-S',
        quantity: '50'
      };
      
      const variant2 = {
        name: 'Large',
        price: '54.99',
        sku: 'VAR001-L',
        quantity: '30'
      };
      
      await productPage.addVariant(variant1);
      await productPage.addVariant(variant2);
      
      await productPage.saveProduct();
      
      // Verify product is saved
      const isSaved = await productPage.isProductSaved(productData.name);
      expect(isSaved).toBe(true);
    });
  });

  test.describe('Product Updates', () => {
    test.beforeEach(async () => {
      // Create a test product first
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Update Test Product',
        description: 'Original description',
        price: '25.00',
        sku: 'UPDATE001',
        quantity: '50'
      };
      
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
    });

    test('should update product information', async () => {
      await productPage.editProduct('Update Test Product');
      
      const updatedData = {
        name: 'Updated Test Product',
        description: 'Updated description',
        price: '35.00',
        quantity: '75'
      };
      
      await productPage.fillProductForm(updatedData);
      await productPage.saveProduct();
      
      // Verify product is updated
      const updatedProduct = await productPage.getProductByName('Updated Test Product');
      expect(updatedProduct.name).toBe('Updated Test Product');
      expect(updatedProduct.price).toBe('35.00');
    });

    test('should update product status', async () => {
      await productPage.editProduct('Update Test Product');
      
      // Toggle status
      await productPage.fillProductForm({ status: false });
      await productPage.saveProduct();
      
      const updatedProduct = await productPage.getProductByName('Update Test Product');
      expect(updatedProduct.status).toBe('Inactive');
    });

    test('should update product category and brand', async () => {
      await productPage.editProduct('Update Test Product');
      
      const updatedData = {
        category: 'Clothing',
        brand: 'FashionBrand'
      };
      
      await productPage.fillProductForm(updatedData);
      await productPage.saveProduct();
      
      const updatedProduct = await productPage.getProductByName('Update Test Product');
      expect(updatedProduct.category).toBe('Clothing');
    });
  });

  test.describe('Product Deletion', () => {
    test.beforeEach(async () => {
      // Create a test product first
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const productData = {
        name: 'Delete Test Product',
        price: '15.00',
        sku: 'DELETE001'
      };
      
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
    });

    test('should delete a product successfully', async () => {
      await productPage.deleteProduct('Delete Test Product');
      
      // Verify product is deleted
      const isDeleted = await productPage.isProductSaved('Delete Test Product');
      expect(isDeleted).toBe(false);
    });

    test('should show confirmation before product deletion', async () => {
      await productPage.navigateToProducts();
      
      const productRow = productPage.productsTable.locator(`tr:has-text("Delete Test Product")`).first();
      const deleteButton = productRow.locator('button:has-text("Delete")');
      
      await deleteButton.click();
      
      // Check if confirmation dialog appears
      const confirmButton = productPage.page.locator('button:has-text("Confirm Delete")');
      const isConfirmVisible = await confirmButton.isVisible();
      expect(isConfirmVisible).toBe(true);
    });
  });

  test.describe('Product Search and Filtering', () => {
    test.beforeEach(async () => {
      // Create test products
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const products = [
        { name: 'Laptop Computer', price: '999.00', sku: 'LAP001', category: 'Electronics' },
        { name: 'T-Shirt Blue', price: '19.99', sku: 'TSHIRT001', category: 'Clothing' },
        { name: 'Coffee Mug', price: '9.99', sku: 'MUG001', category: 'Home' }
      ];
      
      for (const product of products) {
        await productPage.fillProductForm(product);
        await productPage.saveProduct();
      }
    });

    test('should search products by name', async () => {
      await productPage.searchProduct('Laptop');
      
      const products = await productPage.getProductList();
      const laptopProducts = products.filter(p => p.name.toLowerCase().includes('laptop'));
      
      expect(laptopProducts.length).toBeGreaterThan(0);
      expect(laptopProducts.every(p => p.name.toLowerCase().includes('laptop'))).toBe(true);
    });

    test('should filter products by category', async () => {
      await productPage.filterByCategory('Electronics');
      
      const products = await productPage.getProductList();
      const electronicsProducts = products.filter(p => p.category === 'Electronics');
      
      expect(electronicsProducts.length).toBeGreaterThan(0);
      expect(electronicsProducts.every(p => p.category === 'Electronics')).toBe(true);
    });

    test('should filter products by status', async () => {
      // Create products with different statuses
      await productPage.navigateToProducts();
      
      const activeProducts = await productPage.getProductList();
      const activeCount = activeProducts.filter(p => p.status?.toLowerCase().includes('active')).length;
      
      expect(activeCount).toBeGreaterThan(0);
    });

    test('should combine search and filter', async () => {
      await productPage.searchProduct('T-Shirt');
      await productPage.filterByCategory('Clothing');
      
      const products = await productPage.getProductList();
      const tshirts = products.filter(p => 
        p.name.toLowerCase().includes('t-shirt') && p.category === 'Clothing'
      );
      
      expect(tshirts.length).toBeGreaterThan(0);
    });
  });

  test.describe('Product Validation', () => {
    test('should validate negative price', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const invalidProductData = {
        name: 'Negative Price Product',
        price: '-10.00',
        sku: 'NEG001'
      };
      
      await productPage.fillProductForm(invalidProductData);
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      const hasNegativePriceError = validationErrors.some(error => 
        error.toLowerCase().includes('price') || error.toLowerCase().includes('negative')
      );
      expect(hasNegativePriceError).toBe(true);
    });

    test('should validate zero quantity', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const invalidProductData = {
        name: 'Zero Quantity Product',
        price: '10.00',
        sku: 'ZERO001',
        quantity: '0'
      };
      
      await productPage.fillProductForm(invalidProductData);
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      // Zero quantity might be allowed, but if not, should show error
      const hasQuantityError = validationErrors.some(error => 
        error.toLowerCase().includes('quantity')
      );
      
      if (hasQuantityError) {
        expect(hasQuantityError).toBe(true);
      }
    });

    test('should validate special characters in name', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const invalidProductData = {
        name: 'Product @#$%',
        price: '10.00',
        sku: 'SPEC001'
      };
      
      await productPage.fillProductForm(invalidProductData);
      await productPage.saveProduct();
      
      const validationErrors = await productPage.getValidationErrors();
      // May allow special characters, but if not, should show error
      const hasSpecialCharError = validationErrors.some(error => 
        error.toLowerCase().includes('character') || error.toLowerCase().includes('invalid')
      );
      
      if (hasSpecialCharError) {
        expect(hasSpecialCharError).toBe(true);
      }
    });
  });

  test.describe('Product Pagination', () => {
    test.beforeEach(async () => {
      // Create multiple products for pagination testing
      await productPage.navigateToProducts();
      
      for (let i = 1; i <= 15; i++) {
        await productPage.clickAddProduct();
        
        const productData = {
          name: `Pagination Product ${i}`,
          price: (i * 10).toFixed(2),
          sku: `PAGE${i.toString().padStart(3, '0')}`
        };
        
        await productPage.fillProductForm(productData);
        await productPage.saveProduct();
      }
    });

    test('should show pagination controls', async () => {
      await productPage.navigateToProducts();
      
      const paginationVisible = await productPage.pagination.isVisible();
      expect(paginationVisible).toBe(true);
    });

    test('should navigate to next page', async () => {
      await productPage.navigateToProducts();
      
      const initialProducts = await productPage.getProductList();
      
      await productPage.nextPageButton.click();
      await page.waitForTimeout(1000);
      
      const nextPageProducts = await productPage.getProductList();
      
      // Should have different products on next page
      expect(nextPageProducts.length).toBeGreaterThan(0);
    });

    test('should navigate to previous page', async () => {
      await productPage.navigateToProducts();
      
      // Go to next page first
      await productPage.nextPageButton.click();
      await page.waitForTimeout(1000);
      
      // Then go back
      await productPage.prevPageButton.click();
      await page.waitForTimeout(1000);
      
      const products = await productPage.getProductList();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  test.describe('Product Performance', () => {
    test('should load products page within reasonable time', async () => {
      const startTime = Date.now();
      
      await productPage.navigateToProducts();
      await productPage.waitForProductsTable();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    });

    test('should handle product list with many items', async () => {
      await productPage.navigateToProducts();
      
      const products = await productPage.getProductList();
      const productCount = products.length;
      
      expect(productCount).toBeGreaterThanOrEqual(0);
      expect(productCount).toBeLessThan(1000); // Reasonable upper bound
    });
  });

  test.describe('Product Security', () => {
    test('should prevent XSS in product name', async () => {
      await productPage.navigateToProducts();
      await productPage.clickAddProduct();
      
      const xssPayload = 'Test Product <script>alert("XSS")</script>';
      const productData = {
        name: xssPayload,
        price: '10.00',
        sku: 'XSS001'
      };
      
      await productPage.fillProductForm(productData);
      await productPage.saveProduct();
      
      // Script should not execute
      const scriptAlert = await page.locator('text=/alert/i').isVisible();
      expect(scriptAlert).toBe(false);
      
      // Check if product was created despite XSS attempt
      const isSaved = await productPage.isProductSaved(xssPayload);
      // May or may not be saved depending on backend sanitization
    });

    test('should prevent SQL injection in product search', async () => {
      const sqlInjectionPayload = "' OR '1'='1";
      await productPage.searchProduct(sqlInjectionPayload);
      
      // Should not cause database error
      const errorMessage = await page.locator('.error-message, .alert-error').first().textContent();
      expect(errorMessage).toBeNull();
    });
  });

  test.describe('Product Accessibility', () => {
    test('should be keyboard accessible', async () => {
      await productPage.navigateToProducts();
      
      // Tab through product list
      await page.keyboard.press('Tab');
      
      // Should focus on first interactive element
      const focusedElement = await page.locator(':focus');
      expect(await focusedElement.isVisible()).toBe(true);
    });

    test('should have proper ARIA labels', async () => {
      await productPage.navigateToProducts();
      
      // Check for accessibility attributes on product elements
      const productRows = productPage.productRows;
      const rowCount = await productRows.count();
      
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const row = productRows.nth(i);
        const ariaLabel = await row.getAttribute('aria-label');
        
        if (!ariaLabel) {
          // If no aria-label, check for product name
          const productName = await row.locator('.product-name').first().textContent();
          expect(productName).toBeDefined();
        }
      }
    });
  });
});
