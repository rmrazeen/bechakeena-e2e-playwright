// pages/settings.page.js
import { Page, expect } from '@playwright/test';

export class SettingsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.settingsMenuItem = page.locator('text=/Settings|Settings/i').first();
    this.generalSettingsTab = page.locator('text=/General|General/i').first();
    this.emailSettingsTab = page.locator('text=/Email|Email/i').first();
    this.notificationSettingsTab = page.locator('text=/Notifications|Notifications/i').first();
    
    // General settings
    this.siteNameInput = page.locator('input[name="site_name"], input[placeholder*="site name"]');
    this.siteDescriptionInput = page.locator('textarea[name="site_description"], textarea[placeholder*="description"]');
    this.siteUrlInput = page.locator('input[name="site_url"], input[placeholder*="site url"]');
    this.timezoneSelect = page.locator('select[name="timezone"], select[placeholder*="timezone"]');
    this.languageSelect = page.locator('select[name="language"], select[placeholder*="language"]');
    this.currencySelect = page.locator('select[name="currency"], select[placeholder*="currency"]');
    this.saveGeneralButton = page.locator('button:has-text("Save General")');
    
    // Email settings
    this.smtpHostInput = page.locator('input[name="smtp_host"], input[placeholder*="SMTP host"]');
    this.smtpPortInput = page.locator('input[name="smtp_port"], input[placeholder*="SMTP port"]');
    this.smtpUsernameInput = page.locator('input[name="smtp_username"], input[placeholder*="SMTP username"]');
    this.smtpPasswordInput = page.locator('input[name="smtp_password"], input[placeholder*="SMTP password"]');
    this.smtpFromEmailInput = page.locator('input[name="smtp_from_email"], input[placeholder*="from email"]');
    this.smtpFromNameInput = page.locator('input[name="smtp_from_name"], input[placeholder*="from name"]');
    this.testEmailButton = page.locator('button:has-text("Test Email")');
    this.saveEmailButton = page.locator('button:has-text("Save Email")');
    
    // Notification settings
    this.orderNotificationsCheckbox = page.locator('input[type="checkbox"][name="order_notifications"]');
    this.userNotificationsCheckbox = page.locator('input[type="checkbox"][name="user_notifications"]');
    this.paymentNotificationsCheckbox = page.locator('input[type="checkbox"][name="payment_notifications"]');
    this.systemNotificationsCheckbox = page.locator('input[type="checkbox"][name="system_notifications"]');
    this.emailNotificationsCheckbox = page.locator('input[type="checkbox"][name="email_notifications"]');
    this.pushNotificationsCheckbox = page.locator('input[type="checkbox"][name="push_notifications"]');
    this.saveNotificationsButton = page.locator('button:has-text("Save Notifications")');
    
    // Email templates
    this.emailTemplatesSection = page.locator('.email-templates');
    this.templateSelect = page.locator('select[name="template"], select[placeholder*="template"]');
    this.templateSubjectInput = page.locator('input[name="template_subject"], input[placeholder*="subject"]');
    this.templateBodyInput = page.locator('textarea[name="template_body"], textarea[placeholder*="body"]');
    this.saveTemplateButton = page.locator('button:has-text("Save Template")');
    this.previewTemplateButton = page.locator('button:has-text("Preview")');
    
    // Settings tabs
    this.settingsTabs = page.locator('.settings-tabs, .nav-tabs');
    this.activeTab = page.locator('.tab-active, .active');
    
    // Validation and feedback
    this.validationErrors = page.locator('.error-message, .invalid-feedback, .validation-error');
    this.successMessage = page.locator('.success-message, .alert-success');
    this.testEmailResult = page.locator('.test-email-result, .email-test-result');
    
    // Toast notifications
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"][class*="success"]');
    this.errorToast = page.locator('.toast-error, .alert-error, [role="alert"][class*="error"]');
  }

  async navigateToSettings() {
    await this.settingsMenuItem.click();
    await expect(this.generalSettingsTab).toBeVisible({ timeout: 10000 });
  }

  async switchToGeneralSettings() {
    await this.generalSettingsTab.click();
    await expect(this.siteNameInput).toBeVisible();
  }

  async switchToEmailSettings() {
    await this.emailSettingsTab.click();
    await expect(this.smtpHostInput).toBeVisible();
  }

  async switchToNotificationSettings() {
    await this.notificationSettingsTab.click();
    await expect(this.orderNotificationsCheckbox).toBeVisible();
  }

  async fillGeneralSettings(settingsData) {
    if (settingsData.siteName) await this.siteNameInput.fill(settingsData.siteName);
    if (settingsData.siteDescription) await this.siteDescriptionInput.fill(settingsData.siteDescription);
    if (settingsData.siteUrl) await this.siteUrlInput.fill(settingsData.siteUrl);
    if (settingsData.timezone) await this.timezoneSelect.selectOption({ label: settingsData.timezone });
    if (settingsData.language) await this.languageSelect.selectOption({ label: settingsData.language });
    if (settingsData.currency) await this.currencySelect.selectOption({ label: settingsData.currency });
  }

  async saveGeneralSettings() {
    await this.saveGeneralButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async fillEmailSettings(emailData) {
    if (emailData.smtpHost) await this.smtpHostInput.fill(emailData.smtpHost);
    if (emailData.smtpPort) await this.smtpPortInput.fill(emailData.smtpPort);
    if (emailData.smtpUsername) await this.smtpUsernameInput.fill(emailData.smtpUsername);
    if (emailData.smtpPassword) await this.smtpPasswordInput.fill(emailData.smtpPassword);
    if (emailData.smtpFromEmail) await this.smtpFromEmailInput.fill(emailData.smtpFromEmail);
    if (emailData.smtpFromName) await this.smtpFromNameInput.fill(emailData.smtpFromName);
  }

  async saveEmailSettings() {
    await this.saveEmailButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async testEmailConfiguration(testEmail) {
    await this.testEmailButton.click();
    
    // Wait for test result
    await this.page.waitForTimeout(3000);
    
    if (await this.testEmailResult.isVisible()) {
      return await this.testEmailResult.textContent();
    }
    
    return null;
  }

  async configureNotifications(notificationData) {
    if (notificationData.orderNotifications !== undefined) {
      if (notificationData.orderNotifications) {
        await this.orderNotificationsCheckbox.check();
      } else {
        await this.orderNotificationsCheckbox.uncheck();
      }
    }
    
    if (notificationData.userNotifications !== undefined) {
      if (notificationData.userNotifications) {
        await this.userNotificationsCheckbox.check();
      } else {
        await this.userNotificationsCheckbox.uncheck();
      }
    }
    
    if (notificationData.paymentNotifications !== undefined) {
      if (notificationData.paymentNotifications) {
        await this.paymentNotificationsCheckbox.check();
      } else {
        await this.paymentNotificationsCheckbox.uncheck();
      }
    }
    
    if (notificationData.systemNotifications !== undefined) {
      if (notificationData.systemNotifications) {
        await this.systemNotificationsCheckbox.check();
      } else {
        await this.systemNotificationsCheckbox.uncheck();
      }
    }
    
    if (notificationData.emailNotifications !== undefined) {
      if (notificationData.emailNotifications) {
        await this.emailNotificationsCheckbox.check();
      } else {
        await this.emailNotificationsCheckbox.uncheck();
      }
    }
    
    if (notificationData.pushNotifications !== undefined) {
      if (notificationData.pushNotifications) {
        await this.pushNotificationsCheckbox.check();
      } else {
        await this.pushNotificationsCheckbox.uncheck();
      }
    }
  }

  async saveNotifications() {
    await this.saveNotificationsButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async selectEmailTemplate(templateName) {
    await this.templateSelect.selectOption({ label: templateName });
    await expect(this.templateSubjectInput).toBeVisible();
  }

  async fillEmailTemplate(templateData) {
    if (templateData.subject) await this.templateSubjectInput.fill(templateData.subject);
    if (templateData.body) await this.templateBodyInput.fill(templateData.body);
  }

  async saveEmailTemplate() {
    await this.saveTemplateButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async previewEmailTemplate() {
    await this.previewTemplateButton.click();
    // Wait for preview modal to appear
    await this.page.waitForTimeout(2000);
    return await this.page.locator('.email-preview-modal').isVisible();
  }

  async getGeneralSettings() {
    return {
      siteName: await this.siteNameInput.inputValue(),
      siteDescription: await this.siteDescriptionInput.inputValue(),
      siteUrl: await this.siteUrlInput.inputValue(),
      timezone: await this.timezoneSelect.inputValue(),
      language: await this.languageSelect.inputValue(),
      currency: await this.currencySelect.inputValue()
    };
  }

  async getEmailSettings() {
    return {
      smtpHost: await this.smtpHostInput.inputValue(),
      smtpPort: await this.smtpPortInput.inputValue(),
      smtpUsername: await this.smtpUsernameInput.inputValue(),
      smtpPassword: await this.smtpPasswordInput.inputValue(),
      smtpFromEmail: await this.smtpFromEmailInput.inputValue(),
      smtpFromName: await this.smtpFromNameInput.inputValue()
    };
  }

  async getNotificationSettings() {
    return {
      orderNotifications: await this.orderNotificationsCheckbox.isChecked(),
      userNotifications: await this.userNotificationsCheckbox.isChecked(),
      paymentNotifications: await this.paymentNotificationsCheckbox.isChecked(),
      systemNotifications: await this.systemNotificationsCheckbox.isChecked(),
      emailNotifications: await this.emailNotificationsCheckbox.isChecked(),
      pushNotifications: await this.pushNotificationsCheckbox.isChecked()
    };
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

  async validateSettingsAfterReload() {
    // Save settings first
    await this.saveGeneralSettings();
    
    // Navigate away and back to settings
    await this.page.locator('text=/Dashboard|Dashboard/i').first().click();
    await this.page.waitForTimeout(2000);
    await this.navigateToSettings();
    
    // Get current settings
    const currentSettings = await this.getGeneralSettings();
    
    // Validate that settings are still there
    const validationResults = {
      siteNamePersisted: currentSettings.siteName !== '',
      siteDescriptionPersisted: currentSettings.siteDescription !== '',
      siteUrlPersisted: currentSettings.siteUrl !== '',
      timezoneSelected: currentSettings.timezone !== '',
      languageSelected: currentSettings.language !== '',
      currencySelected: currentSettings.currency !== ''
    };
    
    return validationResults;
  }

  async testSettingsPersistence() {
    const testResults = [];
    
    // Test general settings persistence
    const generalResults = await this.validateSettingsAfterReload();
    testResults.push({
      section: 'General Settings',
      results: generalResults
    });
    
    // Test email settings persistence
    await this.switchToEmailSettings();
    const emailResults = await this.validateSettingsAfterReload();
    testResults.push({
      section: 'Email Settings',
      results: emailResults
    });
    
    // Test notification settings persistence
    await this.switchToNotificationSettings();
    const notificationResults = await this.validateSettingsAfterReload();
    testResults.push({
      section: 'Notification Settings',
      results: notificationResults
    });
    
    return testResults;
  }

  async testInvalidEmailConfiguration() {
    const invalidConfig = {
      smtpHost: 'invalid-host',
      smtpPort: 'invalid-port',
      smtpUsername: '',
      smtpPassword: '',
      smtpFromEmail: 'invalid-email',
      smtpFromName: ''
    };
    
    await this.switchToEmailSettings();
    await this.fillEmailSettings(invalidConfig);
    await this.saveEmailSettings();
    
    const errors = await this.getValidationErrors();
    return errors;
  }

  async testTemplateEditing() {
    const templateData = {
      subject: 'Test Subject {{customer_name}}',
      body: 'Hello {{customer_name}},\n\nThis is a test email template.\n\nThank you,\n{{site_name}}'
    };
    
    await this.selectEmailTemplate('Order Confirmation');
    await this.fillEmailTemplate(templateData);
    await this.saveEmailTemplate();
    
    // Verify template is saved
    const errors = await this.getValidationErrors();
    return errors.length === 0;
  }

  async testTemplateVariables() {
    // Test template variables are properly rendered
    await this.selectEmailTemplate('Order Confirmation');
    await this.fillEmailTemplate({
      subject: 'Test {{customer_name}} Order',
      body: 'Dear {{customer_name}},\n\nYour order {{order_number}} is {{order_status}}.\n\nTotal: {{order_total}}\n\nRegards,\n{{site_name}}'
    });
    
    const previewVisible = await this.previewEmailTemplate();
    return previewVisible;
  }

  async getActiveTab() {
    return this.activeTab.textContent();
  }

  async validateRequiredFields() {
    const requiredFieldErrors = [];
    
    // Clear all required fields
    await this.siteNameInput.clear();
    await this.siteUrlInput.clear();
    await this.smtpHostInput.clear();
    await this.smtpFromEmailInput.clear();
    
    // Try to save
    await this.saveGeneralSettings();
    
    const errors = await this.getValidationErrors();
    
    // Check for required field errors
    for (const error of errors) {
      if (error.toLowerCase().includes('required') || 
          error.toLowerCase().includes('mandatory') ||
          error.toLowerCase().includes('empty') ||
          error.toLowerCase().includes('blank')) {
        requiredFieldErrors.push(error);
      }
    }
    
    return requiredFieldErrors;
  }
}
