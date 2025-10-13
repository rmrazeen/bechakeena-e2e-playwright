// pages/dashboard.page.js
import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard elements
    this.kpiCards = page.locator('.kpi-card, .stat-card, .metric-card');
    this.charts = page.locator('.chart, .chart-container, .revenue-chart');
    this.summaryCards = page.locator('.summary-card, .overview-card');
    
    // KPI specific elements
    this.totalRevenueCard = page.locator('text=/Total Revenue|Revenue/i');
    this.totalOrdersCard = page.locator('text=/Total Orders|Orders/i');
    this.totalCustomersCard = page.locator('text=/Total Customers|Customers/i');
    this.totalProductsCard = page.locator('text=/Total Products|Products/i');
    
    // Charts
    this.revenueChart = page.locator('.revenue-chart, .sales-chart');
    this.ordersChart = page.locator('.orders-chart, .chart-orders');
    this.customersChart = page.locator('.customers-chart, .chart-customers');
    
    // Recent activities
    this.recentOrders = page.locator('.recent-orders, .latest-orders');
    this.recentCustomers = page.locator('.recent-customers, .latest-customers');
    
    // Dashboard navigation
    this.dashboardTitle = page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard")');
    this.sidebar = page.locator('.sidebar, .nav-sidebar');
    this.menuItems = page.locator('.nav-item, .menu-item');
    
    // Date range filters
    this.dateFilter = page.locator('.date-filter, .daterange-picker');
    this.todayButton = page.locator('button:has-text("Today")');
    this.weekButton = page.locator('button:has-text("Week")');
    this.monthButton = page.locator('button:has-text("Month")');
    this.yearButton = page.locator('button:has-text("Year")');
    
    // Refresh button
    this.refreshButton = page.locator('button:has-text("Refresh"), .refresh-btn, .refresh-button');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardTitle).toBeVisible({ timeout: 10000 });
    await expect(this.kpiCards.first()).toBeVisible();
  }

  async getKPIValues() {
    const kpiValues = {};
    
    // Extract KPI values - these selectors will need to be adjusted based on actual implementation
    const revenueText = await this.totalRevenueCard.locator('.value, .amount, .number').textContent();
    const ordersText = await this.totalOrdersCard.locator('.value, .amount, .number').textContent();
    const customersText = await this.totalCustomersCard.locator('.value, .amount, .number').textContent();
    const productsText = await this.totalProductsCard.locator('.value, .amount, .number').textContent();
    
    kpiValues.totalRevenue = revenueText ? parseFloat(revenueText.replace(/[^0-9.-]/g, '')) : 0;
    kpiValues.totalOrders = ordersText ? parseInt(ordersText.replace(/[^0-9]/g, '')) : 0;
    kpiValues.totalCustomers = customersText ? parseInt(customersText.replace(/[^0-9]/g, '')) : 0;
    kpiValues.totalProducts = productsText ? parseInt(productsText.replace(/[^0-9]/g, '')) : 0;
    
    return kpiValues;
  }

  async waitForKPIUpdate() {
    // Wait for KPI values to refresh
    await this.page.waitForTimeout(2000);
    await expect(this.kpiCards.first()).toBeVisible();
  }

  async selectDateRange(range) {
    if (await this.dateFilter.isVisible()) {
      await this.dateFilter.click();
    }
    
    switch(range.toLowerCase()) {
      case 'today':
        await this.todayButton.click();
        break;
      case 'week':
        await this.weekButton.click();
        break;
      case 'month':
        await this.monthButton.click();
        break;
      case 'year':
        await this.yearButton.click();
        break;
      default:
        throw new Error(`Invalid date range: ${range}`);
    }
    
    await this.waitForKPIUpdate();
  }

  async refreshDashboard() {
    if (await this.refreshButton.isVisible()) {
      await this.refreshButton.click();
      await this.waitForKPIUpdate();
    }
  }

  async getChartVisibility() {
    return {
      revenueChart: await this.revenueChart.isVisible(),
      ordersChart: await this.ordersChart.isVisible(),
      customersChart: await this.customersChart.isVisible()
    };
  }

  async getRecentOrders() {
    const orders = [];
    const orderElements = await this.recentOrders.locator('.order-item, .list-item').all();
    
    for (const orderElement of orderElements) {
      const orderNumber = await orderElement.locator('.order-number, .item-id').textContent();
      const customerName = await orderElement.locator('.customer-name, .item-customer').textContent();
      const orderStatus = await orderElement.locator('.order-status, .item-status').textContent();
      const orderAmount = await orderElement.locator('.order-amount, .item-amount').textContent();
      
      orders.push({
        orderNumber: orderNumber?.trim(),
        customerName: customerName?.trim(),
        status: orderStatus?.trim(),
        amount: orderAmount?.trim()
      });
    }
    
    return orders;
  }

  async getRecentCustomers() {
    const customers = [];
    const customerElements = await this.recentCustomers.locator('.customer-item, .list-item').all();
    
    for (const customerElement of customerElements) {
      const customerName = await customerElement.locator('.customer-name, .item-name').textContent();
      const customerEmail = await customerElement.locator('.customer-email, .item-email').textContent();
      const customerOrders = await customerElement.locator('.customer-orders, .item-count').textContent();
      
      customers.push({
        name: customerName?.trim(),
        email: customerEmail?.trim(),
        ordersCount: customerOrders?.trim()
      });
    }
    
    return customers;
  }

  async navigateToMenuItem(menuText) {
    const menuItem = this.page.locator(`.nav-item:has-text("${menuText}"), .menu-item:has-text("${menuText}")`);
    await menuItem.click();
  }

  async isDashboardLoaded() {
    return await this.dashboardTitle.isVisible() && await this.kpiCards.first().isVisible();
  }

  async validateKPIFormat() {
    const kpiValues = await this.getKPIValues();
    const errors = [];
    
    if (isNaN(kpiValues.totalRevenue)) {
      errors.push('Total Revenue format is invalid');
    }
    if (isNaN(kpiValues.totalOrders)) {
      errors.push('Total Orders format is invalid');
    }
    if (isNaN(kpiValues.totalCustomers)) {
      errors.push('Total Customers format is invalid');
    }
    if (isNaN(kpiValues.totalProducts)) {
      errors.push('Total Products format is invalid');
    }
    
    return errors;
  }

  async getDashboardTitle() {
    return this.dashboardTitle.textContent();
  }

  async getNumberOfKPIs() {
    return this.kpiCounts.count();
  }
}
