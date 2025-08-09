import { Page, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:4000';

/**
 * Authentication utilities for e2e tests
 */
export class AuthHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Login with test credentials via API and set browser state
   */
  async loginAsTestUser() {
    try {
      // First, try to register a test user if it doesn't exist
      await this.ensureTestUserExists();

      // Then login with the test user
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPassword123!'
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        if (loginData.success && loginData.data.token) {
          // Set the auth token in localStorage via browser context
          await this.page.addInitScript((token) => {
            localStorage.setItem('authToken', token);
            localStorage.setItem('isAuthenticated', 'true');
          }, loginData.data.token);

          // Also set user data if available
          if (loginData.data.user) {
            await this.page.addInitScript((user) => {
              localStorage.setItem('user', JSON.stringify(user));
            }, loginData.data.user);
          }

          return true;
        }
      }

      console.warn('Login failed:', await loginResponse.text());
      return false;
    } catch (error) {
      console.warn('Login error:', error);
      return false;
    }
  }

  /**
   * Ensure test user exists by attempting to register one
   */
  private async ensureTestUserExists() {
    try {
      const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'TestPassword123!',
          role: 'admin' // Use admin role for full access to all features
        }),
      });

      // If registration fails, the user might already exist, which is fine
      if (registerResponse.ok) {
        console.log('Test user registered successfully');
      } else {
        console.log('Test user registration failed (user might already exist)');
      }
    } catch (error) {
      console.warn('Error ensuring test user exists:', error);
    }
  }

  /**
   * Login via the UI (alternative method)
   */
  async loginViaUI() {
    await this.page.goto('/login');
    
    // Fill login form
    await this.page.locator('input[name="email"]').fill('test@example.com');
    await this.page.locator('input[name="password"]').fill('TestPassword123!');
    
    // Submit form
    await this.page.locator('button[type="submit"]').click();
    
    // Wait for redirect to dashboard or main page
    await this.page.waitForURL(/\/(dashboard|)$/, { timeout: 10000 });
  }

  /**
   * Logout and clear authentication state
   */
  async logout() {
    await this.page.evaluate(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    });
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('isAuthenticated') === 'true' && 
             localStorage.getItem('authToken') !== null;
    });
  }

  /**
   * Navigate to a protected route after ensuring authentication
   */
  async navigateToProtectedRoute(route: string) {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      await this.loginAsTestUser();
    }
    await this.page.goto(route);
    await this.page.waitForLoadState('networkidle');
  }
}