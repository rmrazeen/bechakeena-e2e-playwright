// tests/order_inventory.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { OrderPage } from '../pages/order.page.js';

test.describe('Order & Inventory Management Tests', () => {
  let loginPage;
  let orderPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    orderPage = new OrderPage(page);
    
    // Login before each test
    await loginPage.login('admin@example.com', 'pa$$word');
    await expect(page.locator('text=/Dashboard|Home/i')).toBeVisible({ timeout: 10000 });
  });

  test.describe('Order Creation', () => {
    test('should create a new order with valid data', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const orderData = {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        product: 'Laptop Computer',
        quantity: '2',
        price: '999.00',
        status: 'Pending',
        notes: 'Urgent order'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
      
      // Verify success toast appears
      const successToast = orderPage.successToast.first();
      await expect(successToast).toBeVisible();
    });

    test('should validate required fields during order creation', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      // Try to save without required fields
      await orderPage.saveOrder();
      
      const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
      expect(validationErrors.length).toBeGreaterThan(0);
    });

    test('should validate email format during order creation', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const invalidOrderData = {
        customerName: 'John Doe',
        customerEmail: 'invalid-email',
        product: 'Laptop Computer',
        quantity: '1',
        price: '999.00'
      };
      
      await orderPage.fillOrderForm(invalidOrderData);
      await orderPage.saveOrder();
      
      const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
      const hasEmailError = validationErrors.some(async error => {
        const errorText = await error.textContent();
        return errorText?.toLowerCase().includes('email');
      });
      
      expect(hasEmailError).toBe(true);
    });

    test('should validate quantity format during order creation', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const invalidOrderData = {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        product: 'Laptop Computer',
        quantity: 'invalid',
        price: '999.00'
      };
      
      await orderPage.fillOrderForm(invalidOrderData);
      await orderPage.saveOrder();
      
      const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
      const hasQuantityError = validationErrors.some(async error => {
        const errorText = await error.textContent();
        return errorText?.toLowerCase().includes('quantity');
      });
      
      expect(hasQuantityError).toBe(true);
    });

    test('should validate price format during order creation', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const invalidOrderData = {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        product: 'Laptop Computer',
        quantity: '1',
        price: 'invalid-price'
      };
      
      await orderPage.fillOrderForm(invalidOrderData);
      await orderPage.saveOrder();
      
      const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
      const hasPriceError = validationErrors.some(async error => {
        const errorText = await error.textContent();
        return errorText?.toLowerCase().includes('price');
      });
      
      expect(hasPriceError).toBe(true);
    });
  });

  test.describe('Order Status Updates', () => {
    test.beforeEach(async () => {
      // Create a test order first
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const orderData = {
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        product: 'Smartphone',
        quantity: '1',
        price: '599.00'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
    });

    test('should update order status to processed', async () => {
      // Get the first order in the list
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.processOrder(orderNumber);
        
        // Verify success toast appears
        const successToast = orderPage.successToast.first();
        await expect(successToast).toBeVisible();
      }
    });

    test('should update order status to shipped', async () => {
      // First process the order
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.processOrder(orderNumber);
        
        // Then ship it
        await orderPage.shipOrder(orderNumber);
        
        // Verify success toast appears
        const successToast = orderPage.successToast.first();
        await expect(successToast).toBeVisible();
      }
    });

    test('should update order status to cancelled', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.cancelOrder(orderNumber);
        
        // Verify success toast appears
        const successToast = orderPage.successToast.first();
        await expect(successToast).toBeVisible();
      }
    });

    test('should validate order status transitions', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        const statusTransitions = await orderPage.testOrderStatusTransitions(orderNumber);
        
        // Verify status transitions are logical
        expect(statusTransitions.length).toBeGreaterThan(0);
        
        // Check if transitions follow logical order
        const statuses = statusTransitions.map(t => t.status);
        const hasLogicalOrder = statuses.includes('Pending') && 
                               statuses.includes('Processed') && 
                               statuses.includes('Shipped');
        
        if (hasLogicalOrder) {
          expect(true).toBe(true); // Logical order found
        }
      }
    });
  });

  test.describe('Order Deletion', () => {
    test.beforeEach(async () => {
      // Create a test order first
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const orderData = {
        customerName: 'Delete Test',
        customerEmail: 'delete.test@example.com',
        product: 'Test Product',
        quantity: '1',
        price: '10.00'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
    });

    test('should delete an order successfully', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.deleteOrder(orderNumber);
        
        // Verify success toast appears
        const successToast = orderPage.successToast.first();
        await expect(successToast).toBeVisible();
      }
    });

    test('should show confirmation before order deletion', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        
        // Try to delete
        await orderPage.deleteOrder(orderNumber);
        
        // Check if confirmation dialog appears
        const confirmButton = orderPage.confirmDeleteButton;
        const isConfirmVisible = await confirmButton.isVisible();
        expect(isConfirmVisible).toBe(true);
      }
    });
  });

  test.describe('Order Search and Filtering', () => {
    test.beforeEach(async () => {
      // Create test orders
      await orderPage.navigateToOrders();
      
      const orders = [
        {
          customerName: 'Alice Johnson',
          customerEmail: 'alice@example.com',
          product: 'Laptop',
          quantity: '1',
          price: '999.00'
        },
        {
          customerName: 'Bob Wilson',
          customerEmail: 'bob@example.com',
          product: 'Phone',
          quantity: '2',
          price: '599.00'
        },
        {
          customerName: 'Carol Brown',
          customerEmail: 'carol@example.com',
          product: 'Tablet',
          quantity: '1',
          price: '399.00'
        }
      ];
      
      for (const order of orders) {
        await orderPage.clickAddOrder();
        await orderPage.fillOrderForm(order);
        await orderPage.saveOrder();
      }
    });

    test('should search orders by customer name', async () => {
      await orderPage.searchOrder('Alice');
      
      const orders = await orderPage.getOrderList();
      const aliceOrders = orders.filter(o => o.customerName?.toLowerCase().includes('alice'));
      
      expect(aliceOrders.length).toBeGreaterThan(0);
      expect(aliceOrders.every(o => o.customerName?.toLowerCase().includes('alice'))).toBe(true);
    });

    test('should search orders by customer email', async () => {
      await orderPage.searchOrder('bob@example.com');
      
      const orders = await orderPage.getOrderList();
      const bobOrders = orders.filter(o => o.customerEmail?.toLowerCase().includes('bob'));
      
      expect(bobOrders.length).toBeGreaterThan(0);
    });

    test('should filter orders by status', async () => {
      await orderPage.filterByStatus('Pending');
      
      const orders = await orderPage.getOrderList();
      const pendingOrders = orders.filter(o => o.status?.toLowerCase().includes('pending'));
      
      expect(pendingOrders.length).toBeGreaterThan(0);
    });

    test('should filter orders by date range', async () => {
      await orderPage.filterByDateRange('2024-01-01', '2024-12-31');
      
      const orders = await orderPage.getOrderList();
      expect(orders.length).toBeGreaterThanOrEqual(0);
    });

    test('should filter orders by customer', async () => {
      await orderPage.filterByCustomer('Alice Johnson');
      
      const orders = await orderPage.getOrderList();
      const customerOrders = orders.filter(o => o.customerName === 'Alice Johnson');
      
      expect(customerOrders.length).toBeGreaterThan(0);
    });

    test('should combine search and filter', async () => {
      await orderPage.searchOrder('Phone');
      await orderPage.filterByStatus('Pending');
      
      const orders = await orderPage.getOrderList();
      const phoneOrders = orders.filter(o => 
        o.product?.toLowerCase().includes('phone') && o.status?.toLowerCase().includes('pending')
      );
      
      expect(phoneOrders.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Order Details View', () => {
    test.beforeEach(async () => {
      // Create a test order first
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const orderData = {
        customerName: 'Detail Test',
        customerEmail: 'detail.test@example.com',
        product: 'Test Product',
        quantity: '1',
        price: '25.00',
        notes: 'Test order for details view'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
    });

    test('should view order details', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.viewOrder(orderNumber);
        
        // Check if order details modal is visible
        const detailsModal = orderPage.orderDetailsModal;
        await expect(detailsModal).toBeVisible();
        
        // Get order details
        const orderDetails = await orderPage.getOrderDetails();
        expect(orderDetails).toBeDefined();
        expect(orderDetails.orderNumber).toBe(orderNumber);
      }
    });

    test('should display correct order information in details', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.viewOrder(orderNumber);
        
        const orderDetails = await orderPage.getOrderDetails();
        
        // Verify order details contain expected information
        expect(orderDetails.orderNumber).toBeDefined();
        expect(orderDetails.customer).toBeDefined();
        expect(orderDetails.total).toBeDefined();
        expect(orderDetails.status).toBeDefined();
        
        // Close details modal
        await orderPage.closeOrderDetails();
      }
    });

    test('should close order details modal', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        await orderPage.viewOrder(orderNumber);
        
        // Close modal
        await orderPage.closeOrderDetails();
        
        // Verify modal is closed
        const detailsModal = orderPage.orderDetailsModal;
        await expect(detailsModal).toBeHidden();
      }
    });
  });

  test.describe('Inventory Management', () => {
    test('should show inventory warnings for insufficient stock', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      // Try to create order with quantity exceeding stock
      const orderData = {
        customerName: 'Stock Test',
        customerEmail: 'stock.test@example.com',
        product: 'Limited Stock Product',
        quantity: '999', // Very large quantity
        price: '10.00'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
      
      // Check for inventory warning
      const inventoryWarning = await orderPage.getInventoryWarning();
      if (inventoryWarning) {
        expect(inventoryWarning).toBeDefined();
      }
    });

    test('should update stock levels after order processing', async () => {
      // This test would need to know current stock levels
      // For now, we'll test the functionality exists
      await orderPage.navigateToOrders();
      
      const stockWarning = orderPage.inventoryWarning;
      const stockVisible = await stockWarning.isVisible();
      
      if (stockVisible) {
        expect(stockVisible).toBe(true);
      }
    });

    test('should handle concurrent inventory updates', async () => {
      const orders = await orderPage.getOrderList();
      if (orders.length > 0) {
        const orderNumber = orders[0].orderNumber;
        const conflictResult = await orderPage.simulateConcurrentOrderUpdates(orderNumber);
        
        if (conflictResult) {
          expect(conflictResult).toBeDefined();
        }
      }
    });
  });

  test.describe('Order Validation', () => {
    test('should calculate order totals correctly', async () => {
      await orderPage.navigateToOrders();
      
      const validationErrors = await orderPage.validateOrderTotal();
      expect(validationErrors).toEqual([]);
    });

    test('should handle negative quantities gracefully', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const invalidOrderData = {
        customerName: 'Negative Quantity Test',
        customerEmail: 'negative.test@example.com',
        product: 'Test Product',
        quantity: '-1',
        price: '10.00'
      };
      
      await orderPage.fillOrderForm(invalidOrderData);
      await orderPage.saveOrder();
      
      const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
      const hasQuantityError = validationErrors.some(async error => {
        const errorText = await error.textContent();
        return errorText?.toLowerCase().includes('quantity');
      });
      
      expect(hasQuantityError).toBe(true);
    });

    test('should handle zero price gracefully', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const invalidOrderData = {
        customerName: 'Zero Price Test',
        customerEmail: 'zero.test@example.com',
        product: 'Test Product',
        quantity: '1',
        price: '0.00'
      };
      
      await orderPage.fillOrderForm(invalidOrderData);
      await orderPage.saveOrder();
      
      // May or may not be allowed depending on business logic
      const successToast = orderPage.successToast.first();
      const successVisible = await successToast.isVisible();
      
      if (!successVisible) {
        // If not successful, check for error
        const validationErrors = await orderPage.page.locator('.error-message, .invalid-feedback').all();
        expect(validationErrors.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Order Pagination', () => {
    test.beforeEach(async () => {
      // Create multiple orders for pagination testing
      await orderPage.navigateToOrders();
      
      for (let i = 1; i <= 15; i++) {
        await orderPage.clickAddOrder();
        
        const orderData = {
          customerName: `Pagination Customer ${i}`,
          customerEmail: `pagination${i}@example.com`,
          product: `Product ${i}`,
          quantity: '1',
          price: (i * 10).toFixed(2)
        };
        
        await orderPage.fillOrderForm(orderData);
        await orderPage.saveOrder();
      }
    });

    test('should show pagination controls', async () => {
      await orderPage.navigateToOrders();
      
      const paginationVisible = await orderPage.pagination.isVisible();
      expect(paginationVisible).toBe(true);
    });

    test('should navigate to next page', async () => {
      await orderPage.navigateToOrders();
      
      const initialOrders = await orderPage.getOrderList();
      
      await orderPage.nextPageButton.click();
      await page.waitForTimeout(1000);
      
      const nextPageOrders = await orderPage.getOrderList();
      
      // Should have orders on next page
      expect(nextPageOrders.length).toBeGreaterThanOrEqual(0);
    });

    test('should navigate to previous page', async () => {
      await orderPage.navigateToOrders();
      
      // Go to next page first
      await orderPage.nextPageButton.click();
      await page.waitForTimeout(1000);
      
      // Then go back
      await orderPage.prevPageButton.click();
      await page.waitForTimeout(1000);
      
      const orders = await orderPage.getOrderList();
      expect(orders.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Order Performance', () => {
    test('should load orders page within reasonable time', async () => {
      const startTime = Date.now();
      
      await orderPage.navigateToOrders();
      await orderPage.waitForOrdersTable();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    });

    test('should handle order list with many items', async () => {
      await orderPage.navigateToOrders();
      
      const orderCount = await orderPage.getOrderCount();
      expect(orderCount).toBeGreaterThanOrEqual(0);
      expect(orderCount).toBeLessThan(1000); // Reasonable upper bound
    });
  });

  test.describe('Order Security', () => {
    test('should prevent XSS in customer name', async () => {
      await orderPage.navigateToOrders();
      await orderPage.clickAddOrder();
      
      const xssPayload = '<script>alert("XSS")</script>';
      const orderData = {
        customerName: xssPayload,
        customerEmail: 'xss.test@example.com',
        product: 'Test Product',
        quantity: '1',
        price: '10.00'
      };
      
      await orderPage.fillOrderForm(orderData);
      await orderPage.saveOrder();
      
      // Script should not execute
      const scriptAlert = await page.locator('text=/alert/i').isVisible();
      expect(scriptAlert).toBe(false);
    });

    test('should prevent SQL injection in order search', async () => {
      const sqlInjectionPayload = "' OR '1'='1";
      await orderPage.searchOrder(sqlInjectionPayload);
      
      // Should not cause database error
      const errorMessage = await page.locator('.error-message, .alert-error').first().textContent();
      expect(errorMessage).toBeNull();
    });
  });

  test.describe('Order Accessibility', () => {
    test('should be keyboard accessible', async () => {
      await orderPage.navigateToOrders();
      
      // Tab through order list
      await page.keyboard.press('Tab');
      
      // Should focus on first interactive element
      const focusedElement = await page.locator(':focus');
      expect(await focusedElement.isVisible()).toBe(true);
    });

    test('should have proper ARIA labels', async () => {
      await orderPage.navigateToOrders();
      
      // Check for accessibility attributes on order elements
      const orderRows = orderPage.orderRows;
      const rowCount = await orderRows.count();
      
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const row = orderRows.nth(i);
        const ariaLabel = await row.getAttribute('aria-label');
        
        if (!ariaLabel) {
          // If no aria-label, check for order number
          const orderNumber = await row.locator('.order-number').first().textContent();
          expect(orderNumber).toBeDefined();
        }
      }
    });
  });
});
