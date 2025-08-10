// Auth Utilities - Following Clean Code principles
// Single Responsibility: Handle authentication-related utilities
// Open/Closed: Extensible for new auth utilities

/**
 * Clear all stored authentication tokens
 * Useful for debugging and preventing infinite loops
 */
export const clearAuthTokens = (): void => {
  console.log('🧹 [AuthUtils] Clearing all authentication tokens');
  
  // Clear localStorage tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  
  // Clear any other auth-related storage
  sessionStorage.removeItem('authState');
  
  console.log('🧹 [AuthUtils] All authentication tokens cleared');
  console.log('🧹 [AuthUtils] localStorage keys remaining:', Object.keys(localStorage));
};

/**
 * Check current authentication state
 * Useful for debugging authentication issues
 */
export const checkAuthState = (): void => {
  console.log('🔍 [AuthUtils] Checking current authentication state');
  
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  
  console.log('🔍 [AuthUtils] Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('🔍 [AuthUtils] Refresh Token:', refreshToken ? 'Present' : 'Missing');
  console.log('🔍 [AuthUtils] Expires At:', expiresAt || 'Missing');
  
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const isExpired = expiryDate < now;
    console.log('🔍 [AuthUtils] Token Expiry:', expiryDate.toISOString());
    console.log('🔍 [AuthUtils] Is Expired:', isExpired);
    console.log('🔍 [AuthUtils] Time Until Expiry:', Math.floor((expiryDate.getTime() - now.getTime()) / 1000), 'seconds');
  }
};

/**
 * Reset authentication state completely
 * Useful for testing and debugging
 */
export const resetAuthState = (): void => {
  console.log('🔄 [AuthUtils] Resetting complete authentication state');
  
  clearAuthTokens();
  
  // Clear any cached user data
  if (window.location.pathname !== '/login') {
    console.log('🔄 [AuthUtils] Redirecting to login page');
    window.location.href = '/login';
  }
  
  console.log('🔄 [AuthUtils] Authentication state reset complete');
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).clearAuthTokens = clearAuthTokens;
  (window as any).checkAuthState = checkAuthState;
  (window as any).resetAuthState = resetAuthState;
  
  console.log('🔧 [AuthUtils] Authentication utilities available globally:');
  console.log('🔧 [AuthUtils] - window.clearAuthTokens()');
  console.log('🔧 [AuthUtils] - window.checkAuthState()');
  console.log('🔧 [AuthUtils] - window.resetAuthState()');
  
  // Auto-clean problematic tokens on page load to prevent infinite loops
  const autoCleanTokens = () => {
    console.log('🧹 [AuthUtils] Auto-cleaning tokens on page load');
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    // Check if we have tokens that might cause issues
    if (accessToken || refreshToken || expiresAt) {
      console.log('🧹 [AuthUtils] Found stored tokens, checking validity...');
      
      if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const isExpired = expiryDate < now;
        
        if (isExpired) {
          console.log('🧹 [AuthUtils] Found expired tokens, clearing them to prevent infinite loops');
          clearAuthTokens();
        } else {
          console.log('🧹 [AuthUtils] Tokens are still valid, keeping them');
        }
      } else {
        console.log('🧹 [AuthUtils] No expiry date found, clearing tokens to be safe');
        clearAuthTokens();
      }
    } else {
      console.log('🧹 [AuthUtils] No stored tokens found, nothing to clean');
    }
  };
  
  // Run auto-clean when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoCleanTokens);
  } else {
    autoCleanTokens();
  }
}
