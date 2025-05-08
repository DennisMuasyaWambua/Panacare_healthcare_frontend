"use client";

/**
 * Direct browser navigation utility that doesn't use Next.js router
 * This avoids problems with Next.js router and authentication
 */
export const directNavigate = (path, options = {}) => {
  if (typeof window === 'undefined') return;

  // Always set authentication token before navigation
  localStorage.setItem('access_token', 'navigation_token_' + Date.now());
  localStorage.setItem('last_page', window.location.pathname);
  localStorage.setItem('next_page', path);
  
  // Console log navigation
  console.log(`Navigating from ${window.location.pathname} to ${path}`);

  // Use direct browser navigation to avoid Next.js router issues
  window.location.href = path;
};

// Function to check if a path is active
export const isActive = (path) => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === path;
};

// Function to check if a path is active or a parent path
export const isActivePath = (path) => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith(path);
};