# New Authentication System

## Overview

The authentication system has been completely rebuilt with a simplified approach using clearly named localStorage items. This helps eliminate flickering between pages during logout and provides a more predictable authentication flow.

## Key Features

1. **Consistent localStorage Key Names**
   - All keys are prefixed with `panacare_` for easy identification
   - Uses explicit keys like `panacare_auth_token`, `panacare_user_data`

2. **Explicit Authentication States**
   - `authenticated`: User is logged in
   - `unauthenticated`: User is logged out
   - `loading`: Authentication state is being checked

3. **Controlled Logout Process**
   - Sets a `panacare_logout_in_progress` flag before clearing credentials
   - Components check this flag to avoid flickering during logout

4. **Centralized Authentication Utilities**
   - All auth-related functions are in `app/utils/authUtils.js`
   - Single source of truth for auth operations

## How to Use

### Authentication Status

Check if user is authenticated:
```javascript
import authUtils from '../utils/authUtils';

// In component
if (authUtils.isAuthenticated()) {
  // User is logged in
}
```

### Login

Process login response:
```javascript
import authUtils from '../utils/authUtils';

// After successful API login
authUtils.storeAuthData(loginResponse);
```

### Logout

Initiate logout:
```javascript
import authUtils from '../utils/authUtils';

// Start logout process
authUtils.startLogout();

// Clear all auth data
authUtils.completeLogout();
```

### API Requests

Add auth headers to requests:
```javascript
import authUtils from '../utils/authUtils';

const headers = {
  ...authUtils.getAuthHeaders(),
  'Content-Type': 'application/json'
};
```

### User Data

Access user information:
```javascript
import authUtils from '../utils/authUtils';

const user = authUtils.getUserData();
```

## File Changes

1. **New: `app/utils/authUtils.js`**
   - Central location for all auth functions
   - Clear naming conventions for localStorage

2. **Updated: `app/context/AuthContext.js`**
   - Now uses authUtils for all operations
   - Improved state management

3. **Updated: `app/components/ProtectedRoute.js`**
   - Uses authUtils for auth checks
   - Better handling of logout transitions

4. **Updated: `app/utils/api.js`**
   - Uses authUtils for token management
   - Consistent handling of auth headers

5. **Updated: Login and Dashboard Components**
   - Simplified login flow
   - Improved logout process

## Logout Flow

The new logout process follows these steps:

1. User clicks logout
2. `authUtils.startLogout()` sets the `panacare_logout_in_progress` flag
3. Components check this flag to prevent rendering during transition
4. After a short delay, navigation to login begins
5. `authUtils.completeLogout()` clears all auth data
6. User is redirected to login page

This controlled process eliminates the flickering issue by ensuring components don't re-render multiple times during logout.
