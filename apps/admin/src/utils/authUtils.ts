// Auth Utilities
// Single Responsibility: Handle authentication-related storage cleanup.

import { clearLegacyAuthKeys } from '@happy-baby/infrastructure-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRES_AT_KEY = 'tokenExpiresAt';

/**
 * Clear all stored authentication tokens.
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  sessionStorage.removeItem('authState');
};

/**
 * Reset authentication state and send the user back to login.
 */
export const resetAuthState = (): void => {
  clearAuthTokens();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

/**
 * On startup, drop tokens that are already expired (or missing an expiry),
 * which otherwise can trigger redirect loops in the auth flow.
 */
const cleanExpiredTokensOnLoad = (): void => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);

  if (!accessToken && !refreshToken && !expiresAt) {
    return;
  }

  if (!expiresAt || new Date(expiresAt) < new Date()) {
    clearAuthTokens();
  }
};

if (typeof window !== 'undefined') {
  // Limpia claves legacy de versiones anteriores (authToken, user)
  clearLegacyAuthKeys();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanExpiredTokensOnLoad);
  } else {
    cleanExpiredTokensOnLoad();
  }
}
