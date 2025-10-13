// pages/order.page.js
import { Page, expect } from '@playwright/test';

export class OrderPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.ordersMenuItem = page.locator('text=/Orders|Orders/i').first();
    this.addOrderButton = page.locator('button:has-text("Add Order"), button:has-text("New Order"), .btn-add-order');
    this.ordersTable = page.locator('.orders-table, .order-list, table');
    this.orderRows = page.locator('tr:has-text("order"), .order-row');
    
    // Order form elements
    this.customerNameInput = page.locator('input[name="customer_name"], input[placeholder*="customer"]');
    this.customerEmailInput = page.locator('input[name="customer_email"], input[placeholder*="email"]');
    this.productSelect = page.locator('select[name="product"], select[placeholder*="product"]');
    this.quantityInput = page.locator('input[name="quantity"], input[placeholder*="quantity"]');
    this.priceInput = page.locator('input[name="price"], input[placeholder*="price"]');
    this.orderStatusSelect = page.locator('select[name="status"], select[placeholder*="status"]');
    this.orderNotesInput = page.locator('textarea[name="notes"], textarea[placeholder*="notes"]');
    
    // Order details view
    this.orderDetailsModal = page.locator('.order-details-modal, .order-details');
    this.orderNumberDisplay = page.locator('.order-number, .details-order-number');
    this.customerDetails = page.locator('.customer-details');
    this.orderItemsList = page.locator('.order-items, .items-list');
    this.orderTotal = page.locator('.order-total, .total-amount');
    this.orderStatusBadge = page.locator('.order-status-badge');
    
    // Actions
    this.viewButton = page.locator('button:has-text("View"), .btn-view');
    this.editButton = page.locator('button:has-text("Edit"), .btn-edit');
    this.deleteButton = page.locator('button:has-text("Delete"), .btn-delete');
    this.processOrderButton = page.locator('button:has-text("Process"), .btn-process');
    this.shipOrderButton = page.locator('button:has-text("Ship"), .btn-ship');
    this.cancelOrderButton = page.locator('button:has-text("Cancel"), .btn-cancel');
    this.confirmDeleteButton = page.locator('button:has-text("Confirm Delete"), .confirm-delete');
    
    // Search and filters
    this.searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    this.statusFilter = page.locator('select[placeholder*="status"]');
    this.dateRangeFilter = page.locator('input[placeholder*="date"], .daterange-picker');
    this.customerFilter = page.locator('input[placeholder*="customer"], select[placeholder*="customer"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply"), .apply-filters');
    
    // Pagination
    this.pagination = page.locator('.pagination');
    this.nextPageButton = page.locator('button:has-text("Next"), .next-page');
    this.prevPageButton = page.locator('button:has-text("Previous"), .prev-page');
    
    // Inventory management
    this.inventoryWarning = page.locator('.inventory-warning, .stock-warning');
    this.stockLevelIndicator = page.locator('.stock-level, .inventory-level');
    
    // Toast notifications
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"][class*="success"]');
    this.errorToast = page.locator('.toast-error, .alert-error, [role="alert"][class*="error"]');
    this.infoToast = page.locator('.toast-info, .alert-info, [role="alert"][class*="info"]');
  }

  async navigateToOrders() {
    await this.ordersMenuItem.click();
    await expect(this.ordersTable).toBeVisible({ timeout: 10000 });
  }

  async clickAddOrder() {
    await this.addOrderButton.click();
    await expect(this.customerNameInput).toBeVisible();
  }

  async fillOrderForm(orderData) {
    if (orderData.customerName) await this.customerNameInput.fill(orderData.customerName);
    if (orderData.customerEmail) await this.customerEmailInput.fill(orderData.customerEmail);
    if (orderData.product) await this.productSelect.selectOption({ label: orderData.product });
    if (orderData.quantity) await this.quantityInput.fill(orderData.quantity.toString());
    if (orderData.price) await this.priceInput.fill(orderData.price.toString());
    if (orderData.status) await this.orderStatusSelect.selectOption({ label: orderData.status });
    if (orderData.notes) await this.orderNotesInput.fill(orderData.notes);
  }

  async saveOrder() {
    await this.page.locator('button:has-text("Save"), button[type="submit"]').click();
    await expect(this.successToast).toBeVisible();
  }

  async viewOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-view, button:has-text("View")').click();
    await expect(this.orderDetailsModal).toBeVisible();
  }

  async editOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-edit, button:has-text("Edit")').click();
    await expect(this.customerNameInput).toBeVisible();
  }

  async deleteOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-delete, button:has-text("Delete")').click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async processOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-process, button:has-text("Process")').click();
    await expect(this.successToast).toBeVisible();
  }

  async shipOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-ship, button:has-text("Ship")').click();
    await expect(this.successToast).toBeVisible();
  }

  async cancelOrder(orderNumber) {
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    await orderRow.locator('.btn-cancel, button:has-text("Cancel")').click();
    await expect(this.successToast).toBeVisible();
  }

  async getOrderList() {
    const orders = [];
    const orderRows = await this.orderRows.all();
    
    for (const row of orderRows) {
      const orderNumber = await row.locator('.order-number, td:first-child').textContent();
      const customerName = await row.locator('.customer-name').textContent();
      const customerEmail = await row.locator('.customer-email').textContent();
      const product = await row.locator('.product-name').textContent();
      const quantity = await row.locator('.quantity').textContent();
      const price = await row.locator('.price').textContent();
      const total = await row.locator('.total').textContent();
      const status = await row.locator('.order-status').textContent();
      const date = await row.locator('.order-date').textContent();
      
      orders.push({
        orderNumber: orderNumber?.trim(),
        customerName: customerName?.trim(),
        customerEmail: customerEmail?.trim(),
        product: product?.trim(),
        quantity: quantity?.trim(),
        price: price?.trim(),
        total: total?.trim(),
        status: status?.trim(),
        date: date?.trim()
      });
    }
    
    return orders;
  }

  async getOrderDetails() {
    const details = {};
    
    if (await this.orderNumberDisplay.isVisible()) {
      details.orderNumber = await this.orderNumberDisplay.textContent();
    }
    
    if (await this.customerDetails.isVisible()) {
      const customerText = await this.customerDetails.textContent();
      details.customer = customerText?.trim();
    }
    
    if (await this.orderItemsList.isVisible()) {
      details.items = [];
      const itemElements = await this.orderItemsList.locator('.order-item').all();
      
      for (const itemElement of itemElements) {
        const productName = await itemElement.locator('.item-name').textContent();
        const quantity = await itemElement.locator('.item-quantity').textContent();
        const price = await itemElement.locator('.item-price').textContent();
        
        details.items.push({
          product: productName?.trim(),
          quantity: quantity?.trim(),
          price: price?.trim()
        });
      }
    }
    
    if (await this.orderTotal.isVisible()) {
      details.total = await this.orderTotal.textContent();
    }
    
    if (await this.orderStatusBadge.isVisible()) {
      details.status = await this.orderStatusBadge.textContent();
    }
    
    return details;
  }

  async searchOrder(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.applyFiltersButton.click();
    await expect(this.ordersTable).toBeVisible();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption({ label: status });
    await this.applyFiltersButton.click();
    await expect(this.ordersTable).toBeVisible();
  }

  async filterByDateRange(startDate, endDate) {
    await this.dateRangeFilter.fill(`${startDate} - ${endDate}`);
    await this.applyFiltersButton.click();
    await expect(this.ordersTable).toBeVisible();
  }

  async filterByCustomer(customerName) {
    await this.customerFilter.selectOption({ label: customerName });
    await this.applyFiltersButton.click();
    await expect(this.ordersTable).toBeVisible();
  }

  async getInventoryWarning() {
    if (await this.inventoryWarning.isVisible()) {
      return await this.inventoryWarning.textContent();
    }
    return null;
  }

  async getStockLevel(productName) {
    const stockElement = this.stockLevelIndicator.locator(`text="${productName}"`);
    if (await stockElement.isVisible()) {
      return await stockElement.locator('.stock-value').textContent();
    }
    return null;
  }

  async closeOrderDetails() {
    await this.page.locator('.close-modal, .btn-close').click();
  }

  async waitForOrdersTable() {
    await expect(this.ordersTable).toBeVisible({ timeout: 10000 });
  }

  async getOrderCount() {
    return this.orderRows.count();
  }

  async validateOrderTotal() {
    const orders = await this.getOrderList();
    const validationErrors = [];
    
    for (const order of orders) {
      const quantity = parseFloat(order.quantity?.replace(/[^0-9.]/g, '') || '0');
      const price = parseFloat(order.price?.replace(/[^0-9.]/g, '') || '0');
      const expectedTotal = (quantity * price).toFixed(2);
      const actualTotal = order.total?.replace(/[^0-9.]/g, '');
      
      if (actualTotal && expectedTotal !== actualTotal) {
        validationErrors.push(`Order ${order.orderNumber}: Expected total ${expectedTotal}, got ${actualTotal}`);
      }
    }
    
    return validationErrors;
  }

  // Test specific methods
  async createOrderWithInsufficientStock(orderData) {
    await this.clickAddOrder();
    await this.fillOrderForm(orderData);
    await this.saveOrder();
    
    const inventoryWarning = await this.getInventoryWarning();
    return inventoryWarning;
  }

  async createOrderWithInvalidData(invalidData) {
    await this.clickAddOrder();
    await this.fillOrderForm(invalidData);
    await this.saveProduct();
    
    const errors = await this.page.locator('.error-message, .invalid-feedback').all();
    return errors;
  }

  async simulateConcurrentOrderUpdates(orderNumber) {
    // Simulate multiple users updating the same order
    const orderRow = this.ordersTable.locator(`tr:has-text("${orderNumber}")`).first();
    
    // First user - mark as processed
    await orderRow.locator('.btn-process, button:has-text("Process")').click();
    await expect(this.successToast).toBeVisible();
    
    // Second user - try to edit (should show conflict or be blocked)
    await orderRow.locator('.btn-edit, button:has-text("Edit")').click();
    
    // Check for conflict message or validation error
    const conflictMessage = this.page.locator('.conflict-message, .error-message');
    if (await conflictMessage.isVisible()) {
      return await conflictMessage.textContent();
    }
    
    return null;
  }

  async testOrderStatusTransitions(orderNumber) {
    const statusTransitions = [];
    
    // Get initial status
    await this.viewOrder(orderNumber);
    const details = await this.getOrderDetails();
    const initialStatus = details.status;
    statusTransitions.push({ status: initialStatus, action: 'initial' });
    await this.closeOrderDetails();
    
    // Process order
    await this.processOrder(orderNumber);
    await this.viewOrder(orderNumber);
    const processedDetails = await this.getOrderDetails();
    statusTransitions.push({ status: processedDetails.status, action: 'processed' });
    await this.closeOrderDetails();
    
    // Ship order
    await this.shipOrder(orderNumber);
    await this.viewOrder(orderNumber);
    const shippedDetails = await this.getOrderDetails();
    statusTransitions.push({ status: shippedDetails.status, action: 'shipped' });
    await this.closeOrderDetails();
    
    return statusTransitions;
  }
}
