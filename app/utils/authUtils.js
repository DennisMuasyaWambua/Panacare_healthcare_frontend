"use client";

/**
 * Authentication utility for Panacare
 * Handles all authentication-related operations with localStorage using care_panacare prefix
 */

// Constants for localStorage keys (all prefixed with care_panacare_)
const STORAGE_KEYS = {
  AUTH_TOKEN: 'care_panacare_auth_token',
  REFRESH_TOKEN: 'care_panacare_refresh_token',
  USER_DATA: 'care_panacare_user_data',
  AUTH_STATE: 'care_panacare_auth_state',
  LOGOUT_IN_PROGRESS: 'care_panacare_logout_in_progress',
  USER_ROLES: 'care_panacare_user_roles',
};

// Auth states
const AUTH_STATES = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  LOADING: 'loading',
};

/**
 * Clean up any conflicting tokens from localStorage
 */
const cleanupConflictingTokens = () => {
  if (typeof window === 'undefined') return;
  
  // Remove all potential conflicting tokens
  const tokensToRemove = [
    'access_token', 
    'panacare_auth_token', 
    'pana_access_token',
    'panacare_access_token',
    'is_logged_out',
    'refresh_token',
    'panacare_refresh_token',
    'user_data',
    'panacare_user_data',
    'user_roles',
    'panacare_user_roles',
    'role_data',
    'panacare_role_data',
    'panacare_auth_state',
    'panacare_logout_in_progress'
  ];
  
  tokensToRemove.forEach(token => {
    localStorage.removeItem(token);
  });
};

/**
 * Store authentication data in localStorage
 */
export const storeAuthData = (data) => {
  try {
    if (typeof window === 'undefined') return false;

    // First clean up any conflicting tokens
    cleanupConflictingTokens();

    // Store the auth token
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access);
    
    // Store refresh token if available
    if (data.refresh) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
    }
    
    // Store user data
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    }
    
    // Store roles if available
    if (data.roles) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLES, JSON.stringify(data.roles));
    }
    
    // Set auth state
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, AUTH_STATES.AUTHENTICATED);
    
    // Clear any logout flag
    localStorage.removeItem(STORAGE_KEYS.LOGOUT_IN_PROGRESS);
    
    return true;
  } catch (error) {
    console.error('Failed to store auth data:', error);
    return false;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  // First clean up any conflicting tokens
  cleanupConflictingTokens();
  
  // Remove all care_panacare_ prefixed items
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Set to unauthenticated explicitly
  localStorage.setItem(STORAGE_KEYS.AUTH_STATE, AUTH_STATES.UNAUTHENTICATED);
};

/**
 * Start the logout process
 */
export const startLogout = () => {
  if (typeof window === 'undefined') return;
  
  // Set the logout in progress flag
  localStorage.setItem(STORAGE_KEYS.LOGOUT_IN_PROGRESS, 'true');
};

/**
 * Complete the logout process by clearing all data
 */
export const completeLogout = () => {
  clearAuthData();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const state = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
  
  return !!token && state === AUTH_STATES.AUTHENTICATED;
};

/**
 * Check if logout is in progress
 */
export const isLoggingOut = () => {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem(STORAGE_KEYS.LOGOUT_IN_PROGRESS) === 'true';
};

/**
 * Get the current user data
 */
export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Get the auth token
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get the refresh token
 */
export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Update the auth token (after refresh)
 */
export const updateAuthToken = (newToken) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
};

/**
 * Check if user has a specific role
 */
export const hasRole = (roleName) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const roles = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ROLES) || '[]');
    return Array.isArray(roles) && roles.includes(roleName);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

/**
 * For development mode - removed
 */
export const setupDevAuth = () => {
  // Development mode disabled
  return false;
};

const authUtils = {
  storeAuthData,
  clearAuthData,
  startLogout,
  completeLogout,
  isAuthenticated,
  isLoggingOut,
  getUserData,
  getAuthHeaders,
  getAuthToken,
  getRefreshToken,
  updateAuthToken,
  hasRole,
  setupDevAuth,
  cleanupConflictingTokens,
  STORAGE_KEYS,
  AUTH_STATES,
};

export default authUtils;
