// pages/user.page.js
import { Page, expect } from '@playwright/test';

export class UserPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.usersMenuItem = page.locator('text=/Users|Users/i').first();
    this.rolesMenuItem = page.locator('text=/Roles|Roles/i').first();
    this.addUserButton = page.locator('button:has-text("Add User"), button:has-text("New User"), .btn-add-user');
    this.usersTable = page.locator('.users-table, .user-list, table');
    this.userRows = page.locator('tr:has-text("user"), .user-row');
    
    // User form elements
    this.firstNameInput = page.locator('input[name="first_name"], input[placeholder*="first"]');
    this.lastNameInput = page.locator('input[name="last_name"], input[placeholder*="last"]');
    this.emailInput = page.locator('input[name="email"], input[placeholder*="email"]');
    this.passwordInput = page.locator('input[name="password"], input[placeholder*="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirm_password"], input[placeholder*="confirm"]');
    this.roleSelect = page.locator('select[name="role"], select[placeholder*="role"]');
    this.statusToggle = page.locator('input[type="checkbox"][name="status"], .toggle-switch');
    this.permissionsCheckboxes = page.locator('input[type="checkbox"][name="permissions"]');
    
    // User details view
    this.userDetailsModal = page.locator('.user-details-modal, .user-details');
    this.userProfile = page.locator('.user-profile');
    this.userPermissions = page.locator('.user-permissions');
    
    // Actions
    this.viewButton = page.locator('button:has-text("View"), .btn-view');
    this.editButton = page.locator('button:has-text("Edit"), .btn-edit');
    this.deleteButton = page.locator('button:has-text("Delete"), .btn-delete');
    this.resetPasswordButton = page.locator('button:has-text("Reset Password"), .btn-reset-password');
    this.confirmDeleteButton = page.locator('button:has-text("Confirm Delete"), .confirm-delete');
    
    // Search and filters
    this.searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    this.roleFilter = page.locator('select[placeholder*="role"]');
    this.statusFilter = page.locator('select[placeholder*="status"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply"), .apply-filters');
    
    // Pagination
    this.pagination = page.locator('.pagination');
    this.nextPageButton = page.locator('button:has-text("Next"), .next-page');
    this.prevPageButton = page.locator('button:has-text("Previous"), .prev-page');
    
    // Role management
    this.roleNameInput = page.locator('input[name="role_name"], input[placeholder*="role name"]');
    this.roleDescriptionInput = page.locator('textarea[name="role_description"], textarea[placeholder*="description"]');
    this.rolePermissions = page.locator('input[type="checkbox"][name="role_permissions"]');
    this.addRoleButton = page.locator('button:has-text("Add Role"), .btn-add-role');
    
    // Toast notifications
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"][class*="success"]');
    this.errorToast = page.locator('.toast-error, .alert-error, [role="alert"][class*="error"]');
    this.warningToast = page.locator('.toast-warning, .alert-warning, [role="alert"][class*="warning"]');
    
    // Access control elements
    this.restrictedFeatures = page.locator('.restricted-features, .permission-denied');
    this.accessDeniedMessage = page.locator('.access-denied, .unauthorized');
  }

  async navigateToUsers() {
    await this.usersMenuItem.click();
    await expect(this.usersTable).toBeVisible({ timeout: 10000 });
  }

  async navigateToRoles() {
    await this.rolesMenuItem.click();
    await expect(this.page.locator('.roles-table, .role-list')).toBeVisible({ timeout: 10000 });
  }

  async clickAddUser() {
    await this.addUserButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillUserForm(userData) {
    if (userData.firstName) await this.firstNameInput.fill(userData.firstName);
    if (userData.lastName) await this.lastNameInput.fill(userData.lastName);
    if (userData.email) await this.emailInput.fill(userData.email);
    if (userData.password) await this.passwordInput.fill(userData.password);
    if (userData.confirmPassword) await this.confirmPasswordInput.fill(userData.confirmPassword);
    if (userData.role) await this.roleSelect.selectOption({ label: userData.role });
    if (userData.status !== undefined) {
      if (userData.status) {
        await this.statusToggle.check();
      } else {
        await this.statusToggle.uncheck();
      }
    }
    
    // Handle permissions
    if (userData.permissions) {
      for (const permission of userData.permissions) {
        const permissionCheckbox = this.permissionsCheckboxes.locator(`text="${permission}"`);
        await permissionCheckbox.check();
      }
    }
  }

  async saveUser() {
    await this.page.locator('button:has-text("Save"), button[type="submit"]').click();
    await expect(this.successToast).toBeVisible();
  }

  async viewUser(email) {
    const userRow = this.usersTable.locator(`tr:has-text("${email}")`).first();
    await userRow.locator('.btn-view, button:has-text("View")').click();
    await expect(this.userDetailsModal).toBeVisible();
  }

  async editUser(email) {
    const userRow = this.usersTable.locator(`tr:has-text("${email}")`).first();
    await userRow.locator('.btn-edit, button:has-text("Edit")').click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async deleteUser(email) {
    const userRow = this.usersTable.locator(`tr:has-text("${email}")`).first();
    await userRow.locator('.btn-delete, button:has-text("Delete")').click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async resetUserPassword(email) {
    const userRow = this.usersTable.locator(`tr:has-text("${email}")`).first();
    await userRow.locator('.btn-reset-password, button:has-text("Reset Password")').click();
    await expect(this.successToast).toBeVisible();
  }

  async getUserList() {
    const users = [];
    const userRows = await this.userRows.all();
    
    for (const row of userRows) {
      const firstName = await row.locator('.first-name, td:nth-child(1)').textContent();
      const lastName = await row.locator('.last-name, td:nth-child(2)').textContent();
      const email = await row.locator('.email, td:nth-child(3)').textContent();
      const role = await row.locator('.role, td:nth-child(4)').textContent();
      const status = await row.locator('.status, td:nth-child(5)').textContent();
      const joinDate = await row.locator('.join-date, td:nth-child(6)').textContent();
      
      users.push({
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim(),
        role: role?.trim(),
        status: status?.trim(),
        joinDate: joinDate?.trim()
      });
    }
    
    return users;
  }

  async getUserDetails() {
    const details = {};
    
    if (await this.userProfile.isVisible()) {
      const profileText = await this.userProfile.textContent();
      details.profile = profileText?.trim();
    }
    
    if (await this.userDetailsModal.isVisible()) {
      details.email = await this.userDetailsModal.locator('.detail-email').textContent();
      details.role = await this.userDetailsModal.locator('.detail-role').textContent();
      details.status = await this.userDetailsModal.locator('.detail-status').textContent();
      details.permissions = [];
      
      const permissionElements = await this.userDetailsModal.locator('.detail-permission').all();
      for (const element of permissionElements) {
        const permission = await element.textContent();
        details.permissions.push(permission?.trim());
      }
    }
    
    return details;
  }

  async searchUser(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.applyFiltersButton.click();
    await expect(this.usersTable).toBeVisible();
  }

  async filterByRole(role) {
    await this.roleFilter.selectOption({ label: role });
    await this.applyFiltersButton.click();
    await expect(this.usersTable).toBeVisible();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption({ label: status });
    await this.applyFiltersButton.click();
    await expect(this.usersTable).toBeVisible();
  }

  async closeUserDetails() {
    await this.page.locator('.close-modal, .btn-close').click();
  }

  async waitForUsersTable() {
    await expect(this.usersTable).toBeVisible({ timeout: 10000 });
  }

  // Role management methods
  async fillRoleForm(roleData) {
    if (roleData.name) await this.roleNameInput.fill(roleData.name);
    if (roleData.description) await this.roleDescriptionInput.fill(roleData.description);
    
    if (roleData.permissions) {
      for (const permission of roleData.permissions) {
        const permissionCheckbox = this.rolePermissions.locator(`text="${permission}"`);
        await permissionCheckbox.check();
      }
    }
  }

  async saveRole() {
    await this.addRoleButton.click();
    await expect(this.successToast).toBeVisible();
  }

  async getRoleList() {
    const roles = [];
    const roleRows = await this.page.locator('.role-row, tr:has-text("role")').all();
    
    for (const row of roleRows) {
      const roleName = await row.locator('.role-name, td:first-child').textContent();
      const roleDescription = await row.locator('.role-description').textContent();
      const rolePermissions = await row.locator('.role-permissions').textContent();
      
      roles.push({
        name: roleName?.trim(),
        description: roleDescription?.trim(),
        permissions: rolePermissions?.trim()
      });
    }
    
    return roles;
  }

  // Access control testing methods
  async testRestrictedFeatures() {
    const restrictedFeatures = [];
    
    // Try to access admin-only features
    const adminOnlyElements = this.page.locator('.admin-only, .super-admin');
    const elements = await adminOnlyElements.all();
    
    for (const element of elements) {
      if (await element.isVisible()) {
        const featureName = await element.textContent();
        restrictedFeatures.push(featureName?.trim());
      }
    }
    
    return restrictedFeatures;
  }

  async verifyAccessDenied(featureName) {
    // Simulate trying to access a restricted feature
    const featureElement = this.page.locator(`text="${featureName}"`);
    await featureElement.click();
    
    // Check if access denied message is shown
    if (await this.accessDeniedMessage.isVisible()) {
      return await this.accessDeniedMessage.textContent();
    }
    
    // Check if restricted features warning is shown
    if (await this.restrictedFeatures.isVisible()) {
      return await this.restrictedFeatures.textContent();
    }
    
    return null;
  }

  async createUserWithInsufficientPermissions(userData) {
    await this.clickAddUser();
    await this.fillUserForm(userData);
    await this.saveUser();
    
    // Check for permission-related errors
    const errorMessages = await this.errorToast.all();
    const errors = [];
    
    for (const errorElement of errorMessages) {
      const errorText = await errorElement.textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }
    
    return errors;
  }

  async testRoleAssignment() {
    const roleAssignmentTests = [];
    
    // Test admin role
    const adminUser = {
      firstName: 'TestAdmin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'Admin',
      status: true
    };
    
    await this.clickAddUser();
    await this.fillUserForm(adminUser);
    await this.saveUser();
    
    // Test user role
    const normalUser = {
      firstName: 'TestUser',
      lastName: 'One',
      email: 'user1@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'User',
      status: true
    };
    
    await this.clickAddUser();
    await this.fillUserForm(normalUser);
    await this.saveUser();
    
    // Get user lists to verify role assignment
    const users = await this.getUserList();
    
    for (const user of users) {
      roleAssignmentTests.push({
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
    
    return roleAssignmentTests;
  }

  async validateUserFormFields() {
    const errors = [];
    
    // Check for validation errors
    const validationElements = await this.page.locator('.invalid-feedback, .error-message, .validation-error').all();
    
    for (const element of validationElements) {
      const errorText = await element.textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }
    
    return errors;
  }

  async testPasswordValidation(passwordData) {
    await this.clickAddUser();
    
    if (passwordData.password) await this.passwordInput.fill(passwordData.password);
    if (passwordData.confirmPassword) await this.confirmPasswordInput.fill(passwordData.confirmPassword);
    
    await this.saveUser();
    
    // Check for password validation errors
    const passwordErrors = await this.validateUserFormFields();
    return passwordErrors;
  }

  async testDuplicateEmail(email) {
    const duplicateUser = {
      firstName: 'Test',
      lastName: 'User',
      email: email,
      password: 'password123',
      confirmPassword: 'password123',
      role: 'User',
      status: true
    };
    
    await this.clickAddUser();
    await this.fillUserForm(duplicateUser);
    await this.saveUser();
    
    // Check for duplicate email error
    const errors = await this.validateUserFormFields();
    const duplicateError = errors.find(error => error.toLowerCase().includes('email') && error.toLowerCase().includes('already'));
    
    return duplicateError;
  }
}
