// Debug utilities for authentication issues

export const clearAllAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.clear();
  console.log('🧹 All auth data cleared');
};

export const debugLoginRequest = async (email: string, password: string) => {
  console.log('🐛 DEBUG: Starting login request');
  console.log('Email:', email);
  console.log('Password length:', password.length);
  
  try {
    const response = await fetch(import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Explicitly NOT sending Authorization header for login
      },
      body: JSON.stringify({
        query: `
          mutation LoginUser($input: LoginUserInput!) {
            loginUser(input: $input) {
              success
              message
              accessToken
              refreshToken
              user {
                id
                email
                role
                isActive
              }
            }
          }
        `,
        variables: {
          input: {
            email,
            password
          }
        }
      })
    });

    const data = await response.json();
    console.log('🐛 DEBUG: Raw response:', data);
    
    return data;
  } catch (error) {
    console.error('🐛 DEBUG: Network error:', error);
    return { error: error.message };
  }
};

// Make functions available globally for browser console
(window as any).clearAllAuthData = clearAllAuthData;
(window as any).debugLoginRequest = debugLoginRequest;