import { loginSchema, registerSchema } from '../authSchema';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' });
    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors;
    expect(errors?.email).toBeDefined();
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    const errors = result.error?.flatten().fieldErrors;
    expect(errors?.password).toBeDefined();
  });

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'Juan',
    lastName: 'García',
    phone: '+51 999 888 777',
  };

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts registration without phone', () => {
    const { phone: _, ...noPhone } = validData;
    expect(registerSchema.safeParse(noPhone).success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = registerSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: 'bad-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'short1!',
      confirmPassword: 'short1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPassword!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.confirmPassword).toBeDefined();
  });

  it('rejects empty firstName', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty lastName', () => {
    const result = registerSchema.safeParse({ ...validData, lastName: '' });
    expect(result.success).toBe(false);
  });
});
