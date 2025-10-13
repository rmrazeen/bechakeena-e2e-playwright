const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Dashboard', () => {
  const validEmail = 'admin@example.com';
  const validPassword = 'pa$$word';

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await loginPage.assertSuccessfulLogin();
    // Now on dashboard
  });

  test('2.1.1 - Validate data accuracy in KPIs', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.validateKPIs();
  });

  test('2.1.2 - Validate charts rendering', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.validateCharts();
  });

  test('2.1.3 - Validate summaries (e.g., recent orders)', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.validateSummaries();
  });

  test('2.2.1 - Ensure live metrics refresh after CRUD operations', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.performCRUDAndRefresh();
  });
});
