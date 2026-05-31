import { graphql, HttpResponse } from 'msw';
import { mockAuthResponse } from '../fixtures';

const VALID_EMAIL = 'admin@test.com';
const VALID_PASSWORD = 'Password123!';

export const authHandlers = [
  graphql.mutation('LoginUser', ({ variables }) => {
    const { email, password } = variables as Record<string, string>;
    const success = email === VALID_EMAIL && password === VALID_PASSWORD;
    return HttpResponse.json({ data: mockAuthResponse(success) });
  }),

  graphql.mutation('LogoutUser', () =>
    HttpResponse.json({
      data: { logoutUser: { success: true, message: 'Sesión cerrada' } },
    })
  ),

  graphql.query('GetCurrentUser', () =>
    HttpResponse.json({
      data: {
        currentUser: {
          success: false,
          message: 'No autenticado',
          code: '401',
          timestamp: '2026-01-01T00:00:00.000Z',
          data: null,
          metadata: null,
        },
      },
    })
  ),
];
