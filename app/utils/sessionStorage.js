"use client";

/**
 * SessionStorage provides a unified interface for managing authentication state
 * that avoids race conditions and flickering issues during login/logout.
 */
class SessionStorage {
  // Keys used in localStorage
  static keys = {
    ACCESS_TOKEN: 'panacare_access_token',
    REFRESH_TOKEN: 'panacare_refresh_token',
    USER_DATA: 'panacare_user_data',
    USER_ROLES: 'panacare_user_roles',
    ROLE_DATA: 'panacare_role_data',
    AUTH_STATE: 'panacare_auth_state',
  };

  // Authentication states
  static states = {
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    LOGGING_OUT: 'logging_out',
  };

  /**
   * Stores login data in localStorage with a consistent structure
   */
  static storeLoginData(loginResponse) {
    try {
      // Set auth state first to prevent race conditions
      localStorage.setItem(this.keys.AUTH_STATE, this.states.AUTHENTICATED);
      
      // Store tokens
      localStorage.setItem(this.keys.ACCESS_TOKEN, loginResponse.access);
      localStorage.setItem(this.keys.REFRESH_TOKEN, loginResponse.refresh);
      
      // Store user data
      localStorage.setItem(this.keys.USER_DATA, JSON.stringify(loginResponse.user));
      
      // Store roles for easy access
      localStorage.setItem(this.keys.USER_ROLES, JSON.stringify(loginResponse.roles || []));
      
      // Store role data if needed
      localStorage.setItem(this.keys.ROLE_DATA, JSON.stringify(loginResponse.role_data || {}));
      
      return true;
    } catch (error) {
      console.error('Error storing login data:', error);
      return false;
    }
  }

  /**
   * Starts the logout process
   */
  static startLogout() {
    // Set auth state to logging out to prevent flickering
    localStorage.setItem(this.keys.AUTH_STATE, this.states.LOGGING_OUT);
  }

  /**
   * Completes the logout by clearing all auth data
   */
  static completeLogout() {
    // Clear all auth data
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Set to unauthenticated
    localStorage.setItem(this.keys.AUTH_STATE, this.states.UNAUTHENTICATED);
  }

  /**
   * Gets the current authentication state
   */
  static getAuthState() {
    // Default to unauthenticated if no state is set
    return localStorage.getItem(this.keys.AUTH_STATE) || this.states.UNAUTHENTICATED;
  }

  /**
   * Gets the user data
   */
  static getUserData() {
    try {
      const userData = localStorage.getItem(this.keys.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Gets the auth headers for API requests
   */
  static getAuthHeaders() {
    const token = localStorage.getItem(this.keys.ACCESS_TOKEN);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Gets the access token
   */
  static getAccessToken() {
    return localStorage.getItem(this.keys.ACCESS_TOKEN);
  }

  /**
   * Gets the refresh token
   */
  static getRefreshToken() {
    return localStorage.getItem(this.keys.REFRESH_TOKEN);
  }

  /**
   * Checks if the user has a specific role
   */
  static hasRole(roleName) {
    try {
      const roles = JSON.parse(localStorage.getItem(this.keys.USER_ROLES) || '[]');
      return Array.isArray(roles) && roles.includes(roleName);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  /**
   * Gets data for a specific role
   */
  static getRoleData(roleName) {
    try {
      const roleData = JSON.parse(localStorage.getItem(this.keys.ROLE_DATA) || '{}');
      return roleData[roleName] || null;
    } catch (error) {
      console.error('Error getting role data:', error);
      return null;
    }
  }

  /**
   * Updates the access token (e.g., after refresh)
   */
  static updateAccessToken(newToken) {
    localStorage.setItem(this.keys.ACCESS_TOKEN, newToken);
  }

  /**
   * Checks if the user is authenticated
   */
  static isAuthenticated() {
    const authState = this.getAuthState();
    const accessToken = this.getAccessToken();
    return authState === this.states.AUTHENTICATED && !!accessToken;
  }

  /**
   * Checks if the user is currently logging out
   */
  static isLoggingOut() {
    return this.getAuthState() === this.states.LOGGING_OUT;
  }
}

export default SessionStorage;
