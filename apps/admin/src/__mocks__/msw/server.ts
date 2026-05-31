import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { productHandlers } from './handlers/products';

export const server = setupServer(...authHandlers, ...productHandlers);
