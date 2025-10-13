// pages/notification.page.js
import { Page, expect } from '@playwright/test';

export class NotificationPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.notificationsMenuItem = page.locator('text=/Notifications|Notifications/i').first();
    this.notificationHistory = page.locator('.notification-history, .notification-list');
    this.notificationSettings = page.locator('.notification-settings');
    
    // Notification elements
    this.notificationItems = page.locator('.notification-item, .notification-message');
    this.notificationTitle = page.locator('.notification-title, .message-title');
    this.notificationMessage = page.locator('.notification-message, .message-content');
    this.notificationTimestamp = page.locator('.notification-time, .message-time');
    this.notificationType = page.locator('.notification-type, .message-type');
    this.notificationStatus = page.locator('.notification-status, .message-status');
    
    // Notification actions
    this.markAsReadButton = page.locator('button:has-text("Mark as Read"), .btn-mark-read');
    this.markAllAsReadButton = page.locator('button:has-text("Mark All as Read"), .btn-mark-all-read');
    this.deleteNotificationButton = page.locator('button:has-text("Delete"), .btn-delete-notification');
    this.clearAllButton = page.locator('button:has-text("Clear All"), .btn-clear-all');
    
    // Notification types
    this.successNotifications = page.locator('.notification-success, .success-message');
    this.errorNotifications = page.locator('.notification-error, .error-message');
    this.warningNotifications = page.locator('.notification-warning, .warning-message');
    this.infoNotifications = page.locator('.notification-info, .info-message');
    
    // Notification preferences
    this.emailNotificationToggle = page.locator('input[type="checkbox"][name="email_notifications"]');
    this.pushNotificationToggle = page.locator('input[type="checkbox"][name="push_notifications"]');
    this.inAppNotificationToggle = page.locator('input[type="checkbox"][name="in_app_notifications"]');
    this.notificationSoundToggle = page.locator('input[type="checkbox"][name="notification_sound"]');
    
    // Notification filters
    this.filterByType = page.locator('.filter-type, select[placeholder*="type"]');
    this.filterByStatus = page.locator('.filter-status, select[placeholder*="status"]');
    this.filterByDate = page.locator('.filter-date, input[placeholder*="date"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters"), .apply-filters');
    
    // Search
    this.searchNotifications = page.locator('input[placeholder*="search notifications"]');
    
    // Pagination
    this.notificationPagination = page.locator('.notification-pagination');
    this.nextPageButton = page.locator('.next-page, button:has-text("Next")');
    this.prevPageButton = page.locator('.prev-page, button:has-text("Previous")');
    
    // Toast notifications
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"][class*="success"]');
    this.errorToast = page.locator('.toast-error, .alert-error, [role="alert"][class*="error"]');
    this.infoToast = page.locator('.toast-info, .alert-info, [role="alert"][class*="info"]');
    
    // Modal dialogs
    this.notificationModal = page.locator('.notification-modal, .notification-detail');
    this.closeModalButton = page.locator('.close-modal, .btn-close');
  }

  async navigateToNotifications() {
    await this.notificationsMenuItem.click();
    await expect(this.notificationHistory).toBeVisible({ timeout: 10000 });
  }

  async getNotificationCount() {
    return this.notificationItems.count();
  }

  async getNotificationList() {
    const notifications = [];
    const notificationElements = await this.notificationItems.all();
    
    for (const element of notificationElements) {
      const title = await element.locator('.notification-title, .message-title').textContent();
      const message = await element.locator('.notification-message, .message-content').textContent();
      const timestamp = await element.locator('.notification-time, .message-time').textContent();
      const type = await element.locator('.notification-type, .message-type').textContent();
      const status = await element.locator('.notification-status, .message-status').textContent();
      
      notifications.push({
        title: title?.trim(),
        message: message?.trim(),
        timestamp: timestamp?.trim(),
        type: type?.trim(),
        status: status?.trim()
      });
    }
    
    return notifications;
  }

  async markNotificationAsRead(notificationIndex = 0) {
    const notificationItem = this.notificationItems.nth(notificationIndex);
    const markAsReadButton = notificationItem.locator('.btn-mark-read, button:has-text("Mark as Read")');
    
    await markAsReadButton.click();
    await expect(this.successToast).toBeVisible();
    
    // Verify notification status changed
    const statusElement = notificationItem.locator('.notification-status, .message-status');
    const statusText = await statusElement.textContent();
    return statusText?.trim() === 'Read';
  }

  async markAllNotificationsAsRead() {
    await this.markAllAsReadButton.click();
    await expect(this.successToast).toBeVisible();
    
    // Check if all notifications are marked as read
    const notifications = await this.getNotificationList();
    return notifications.every(notification => notification.status === 'Read');
  }

  async deleteNotification(notificationIndex = 0) {
    const notificationItem = this.notificationItems.nth(notificationIndex);
    const deleteButton = notificationItem.locator('.btn-delete-notification, button:has-text("Delete")');
    
    await deleteButton.click();
    await expect(this.successToast).toBeVisible();
    
    // Verify notification is deleted
    return await notificationItem.count() === 0;
  }

  async clearAllNotifications() {
    await this.clearAllButton.click();
    
    // Confirm deletion if confirmation dialog appears
    const confirmButton = this.page.locator('button:has-text("Confirm"), .btn-confirm');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    await expect(this.successToast).toBeVisible();
    return await this.notificationItems.count() === 0;
  }

  async filterNotificationsByType(type) {
    await this.filterByType.selectOption({ label: type });
    await this.applyFiltersButton.click();
    await expect(this.notificationHistory).toBeVisible();
  }

  async filterNotificationsByStatus(status) {
    await this.filterByStatus.selectOption({ label: status });
    await this.applyFiltersButton.click();
    await expect(this.notificationHistory).toBeVisible();
  }

  async filterNotificationsByDate(date) {
    await this.filterByDate.fill(date);
    await this.applyFiltersButton.click();
    await expect(this.notificationHistory).toBeVisible();
  }

  async searchNotifications(query) {
    await this.searchNotifications.fill(query);
    await this.page.waitForTimeout(1000); // Wait for search to complete
    
    const filteredNotifications = await this.getNotificationList();
    return filteredNotifications.filter(notification => 
      notification.title?.toLowerCase().includes(query.toLowerCase()) ||
      notification.message?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getNotificationsByType(type) {
    await this.filterNotificationsByType(type);
    const notifications = await this.getNotificationList();
    return notifications.filter(notification => notification.type === type);
  }

  async getNotificationsByStatus(status) {
    await this.filterNotificationsByStatus(status);
    const notifications = await this.getNotificationList();
    return notifications.filter(notification => notification.status === status);
  }

  async testNotificationTypes() {
    const typeTests = {};
    
    // Test success notifications
    const successCount = await this.successNotifications.count();
    typeTests.success = successCount > 0;
    
    // Test error notifications
    const errorCount = await this.errorNotifications.count();
    typeTests.error = errorCount > 0;
    
    // Test warning notifications
    const warningCount = await this.warningNotifications.count();
    typeTests.warning = warningCount > 0;
    
    // Test info notifications
    const infoCount = await this.infoNotifications.count();
    typeTests.info = infoCount > 0;
    
    return typeTests;
  }

  async testNotificationHandling() {
    const handlingTests = {};
    
    // Test marking as read
    handlingTests.markAsRead = await this.markNotificationAsRead();
    
    // Test deleting notification
    handlingTests.deleteNotification = await this.deleteNotification();
    
    // Test clear all
    handlingTests.clearAll = await this.clearAllNotifications();
    
    return handlingTests;
  }

  async testNotificationFilters() {
    const filterTests = {};
    
    // Test type filter
    const allCount = await this.notificationItems.count();
    await this.filterNotificationsByType('Success');
    const successCount = await this.notificationItems.count();
    filterTests.typeFilter = successCount <= allCount;
    
    // Test status filter
    await this.filterNotificationsByStatus('Unread');
    const unreadCount = await this.notificationItems.count();
    filterTests.statusFilter = unreadCount >= 0;
    
    // Test date filter
    await this.filterNotificationsByDate('today');
    const todayCount = await this.notificationItems.count();
    filterTests.dateFilter = todayCount >= 0;
    
    return filterTests;
  }

  async testNotificationSearch() {
    const searchTests = {};
    
    // Get first notification title
    const notifications = await this.getNotificationList();
    if (notifications.length > 0) {
      const searchTerm = notifications[0].title?.substring(0, 5);
      if (searchTerm) {
        const searchResults = await this.searchNotifications(searchTerm);
        searchTests.searchResults = searchResults.length > 0;
      }
    }
    
    return searchTests;
  }

  async testNotificationPreferences() {
    const preferences = {};
    
    // Check current preferences
    preferences.emailEnabled = await this.emailNotificationToggle.isChecked();
    preferences.pushEnabled = await this.pushNotificationToggle.isChecked();
    preferences.inAppEnabled = await this.inAppNotificationToggle.isChecked();
    preferences.soundEnabled = await this.notificationSoundToggle.isChecked();
    
    // Toggle preferences
    await this.emailNotificationToggle.check();
    preferences.emailToggled = await this.emailNotificationToggle.isChecked();
    
    await this.pushNotificationToggle.uncheck();
    preferences.pushToggled = !await this.pushNotificationToggle.isChecked();
    
    await this.inAppNotificationToggle.check();
    preferences.inAppToggled = await this.inAppNotificationToggle.isChecked();
    
    await this.notificationSoundToggle.toggle();
    preferences.soundToggled = await this.notificationSoundToggle.isChecked();
    
    return preferences;
  }

  async testNotificationPersistence() {
    // Test that notifications persist after page refresh
    const initialCount = await this.notificationItems.count();
    
    // Refresh page
    await this.page.reload();
    
    // Wait for notifications to load
    await expect(this.notificationHistory).toBeVisible({ timeout: 10000 });
    
    const finalCount = await this.notificationItems.count();
    return initialCount === finalCount;
  }

  async testNotificationAccessibility() {
    const accessibilityTests = {};
    
    // Test keyboard navigation
    const firstNotification = this.notificationItems.first();
    await firstNotification.click();
    accessibilityTests.keyboardFocus = await firstNotification.isVisible();
    
    // Test screen reader elements
    const ariaElements = this.page.locator('[aria-label], [aria-describedby]');
    accessibilityTests.ariaElements = await ariaElements.count() > 0;
    
    return accessibilityTests;
  }

  async getNotificationStatistics() {
    const notifications = await this.getNotificationList();
    const stats = {
      total: notifications.length,
      byType: {},
      byStatus: {},
      recent: []
    };
    
    // Count by type
    notifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
    });
    
    // Count by status
    notifications.forEach(notification => {
      stats.byStatus[notification.status] = (stats.byStatus[notification.status] || 0) + 1;
    });
    
    // Get recent notifications (last 5)
    stats.recent = notifications.slice(0, 5);
    
    return stats;
  }

  async waitForNotification(type = null) {
    let notificationLocator = this.notificationItems;
    
    if (type) {
      notificationLocator = this.notificationItems.locator(`.notification-type:has-text("${type}")`);
    }
    
    await expect(notificationLocator.first()).toBeVisible({ timeout: 15000 });
    return notificationLocator.first();
  }

  async closeNotificationModal() {
    if (await this.notificationModal.isVisible()) {
      await this.closeModalButton.click();
      await expect(this.notificationModal).toBeHidden();
    }
  }

  async testNotificationPerformance() {
    const startTime = Date.now();
    
    // Load notifications
    await this.navigateToNotifications();
    
    const loadTime = Date.now() - startTime;
    
    // Test with many notifications
    await this.filterNotificationsByType('All');
    const notificationCount = await this.notificationItems.count();
    
    return {
      loadTime: loadTime,
      notificationCount: notificationCount,
      performance: notificationCount > 0 ? 'Good' : 'Poor'
    };
  }
}
