# Authentication System Changes

## Overview

The authentication system has been completely restructured to provide:

1. A more robust and predictable login/logout flow
2. Centralized auth state management using SessionStorage
3. Elimination of flickering between dashboard and login during logout
4. Clear separation of concerns for auth state vs. component rendering

## Key Files Changed

1. **New Utility: `app/utils/sessionStorage.js`**
   - Created a SessionStorage class that serves as the single source of truth for auth state
   - Uses explicit states (AUTHENTICATED, UNAUTHENTICATED, LOGGING_OUT) to track auth flow
   - Provides consistent methods for reading/writing auth data

2. **API Utility: `app/utils/api.js`**
   - Updated to use SessionStorage for token management
   - Improved token refresh flow
   - Modified logout process to use the new SessionStorage states

3. **Auth Context: `app/context/AuthContext.js`**
   - Switched from direct localStorage access to SessionStorage
   - Improved logout flow with proper state transitions
   - Better handling of auth state changes

4. **Protected Route: `app/components/ProtectedRoute.js`**
   - Now uses SessionStorage directly to check auth state
   - Improved redirect logic to prevent loops
   - Better handling of loading states

5. **Dashboard Layout: `app/dashboard/layout.jsx`**
   - Added a check for logging out state to prevent component rendering during logout
   - Better integration with ProtectedRoute

6. **Login Component: `app/ui/login/Login.jsx`**
   - Simplified login logic
   - Removed unnecessary setTimeout delays

## How the New Auth Flow Works

### Login Process:
1. User enters credentials in Login form
2. On successful API response, login() is called on AuthContext
3. AuthContext uses SessionStorage.storeLoginData() to save tokens and user data
4. SessionStorage sets auth state to AUTHENTICATED
5. Router navigates to dashboard

### Protected Routes:
1. ProtectedRoute checks SessionStorage.isAuthenticated() directly
2. If not authenticated, redirects to login
3. If authenticated, renders children

### Logout Process:
1. User clicks logout in Navbar
2. logout() is called in AuthContext
3. AuthContext calls SessionStorage.startLogout() which sets state to LOGGING_OUT
4. Components check this state to avoid flickering
5. After a short delay to allow React to process state changes:
   - Router navigates to login page
   - SessionStorage.completeLogout() clears all auth data
   - Sets state to UNAUTHENTICATED

### API Token Refresh:
1. API calls use SessionStorage.getAuthHeaders()
2. On 401 errors, refreshAccessToken() is called
3. If refresh succeeds, SessionStorage.updateAccessToken() is called
4. If refresh fails, SessionStorage.startLogout() is called

## Benefits of the New System

1. **Single Source of Truth**: SessionStorage is the definitive source of auth state
2. **State Transitions**: Explicit auth states (AUTHENTICATED, LOGGING_OUT, UNAUTHENTICATED)
3. **Race Condition Prevention**: Controlled logout flow with proper state transitions
4. **No Flickering**: Components check isLoggingOut() to avoid rendering during logout
5. **Better Error Handling**: Consistent error handling for token refresh failures
6. **Simplified Components**: Components can focus on UI rendering, not auth logic

## Using the New System

For components that need auth state:
```jsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Use auth state in component
};
```

For utility functions that need auth headers:
```jsx
import SessionStorage from '../utils/sessionStorage';

const myApiFunction = () => {
  const headers = SessionStorage.getAuthHeaders();
  // Make API calls with headers
};
```
