const { test, expect } = require('@playwright/test');

test.describe('Order & Inventory Management', () => {
  const adminUrl = 'https://devcore.bechakeena.com';
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';

  test.beforeEach(async ({ page }) => {
    await page.goto(adminUrl);
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Sign in")');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('4.1.1 - Validate order list filtering', async ({ page }) => {
    await page.click('text=Orders'); // Navigate to orders
    await page.fill('input[placeholder="Filter orders"]', 'status:pending'); // Adjust for filter input
    await page.click('button:has-text("Filter")');
    const filteredOrders = page.locator('.order-list .order-item');
    await expect(filteredOrders).toHaveCount.greaterThan(0);
    // Verify filtered results show only pending
  });

  test('4.1.2 - Order status updates', async ({ page }) => {
    await page.click('text=Orders');
    await page.click('.order-item:first-child .status-dropdown'); // Select first order
    await page.selectOption('.status-dropdown', 'shipped'); // Adjust
    await page.click('button:has-text("Update Status")');
    await expect(page.locator('.order-item:first-child .status')).toContainText('Shipped');
  });

  test('4.1.3 - Order detail views', async ({ page }) => {
    await page.click('text=Orders');
    await page.click('.order-item:first-child'); // Click to view details
    await expect(page.locator('.order-details')).toBeVisible();
    // Check customer info, items, total, etc.
    await expect(page.locator('.customer-name')).toBeVisible();
    await expect(page.locator('.order-items li')).toHaveCount.greaterThan(0);
  });

  test('4.2.1 - Real-time quantity updates post-order actions', async ({ page }) => {
    // Create an order or update one that affects inventory
    await page.goto('/orders/new'); // Adjust
    await page.fill('input[name="product-sku"]', 'TEST-SKU');
    await page.fill('input[name="quantity"]', '1');
    await page.click('button:has-text("Place Order")');
    
    // Navigate to inventory
    await page.goto('/inventory');
    await page.waitForTimeout(2000); // Wait for update
    const stockQuantity = page.locator('[data-testid="stock-quantity"]'); // For the product
    await expect(stockQuantity).toContainText('Updated quantity'); // Verify decreased
  });

  test('4.2.2 - Inventory updates after order fulfillment', async ({ page }) => {
    // Similar to above, update order to fulfilled
    await page.click('text=Orders');
    await page.click('.order-item:first-child .fulfill-button');
    await page.click('button:has-text("Fulfill")');
    await page.goto('/inventory');
    await expect(page.locator('.inventory-item .quantity')).toContainText('Decreased value');
  });

  test('4.3.1 - Boundary testing: max order quantity', async ({ page }) => {
    await page.goto('/orders/new');
    await page.fill('input[name="quantity"]', '10000'); // Boundary max
    await page.click('button:has-text("Place Order")');
    // Check if handled or error
    await expect(page.locator('text=Quantity exceeds limit')).toBeVisible(); // Or success
  });

  test('4.3.2 - Concurrent updates simulation', async ({ page, context }) => {
    // Use parallel context to simulate concurrent
    const secondPage = await context.newPage();
    await secondPage.goto(adminUrl);
    await secondPage.fill('input[placeholder="Email"]', validEmail);
    await secondPage.fill('input[placeholder="Password"]', validPassword);
    await secondPage.click('button:has-text("Sign in")');
    await secondPage.click('text=Inventory');
    await secondPage.fill('input[name="quantity-adjust"]', '5'); // Adjust stock up
    await secondPage.click('button:has-text("Update")');

    // In main page, concurrent adjust down
    await page.click('text=Inventory');
    await page.fill('input[name="quantity-adjust"]', '-3');
    await page.click('button:has-text("Update")');
    
    // Check final net change
    await page.reload();
    await expect(page.locator('[data-testid="final-stock"]')).toContainText('Net adjusted value');
  });
});
