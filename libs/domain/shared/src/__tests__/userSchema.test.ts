import {
  createUserSchema,
  updateUserSchema,
  createUserFormSchema,
} from '@happy-baby/domain-shared';

describe('createUserSchema', () => {
  const validData = {
    email: 'user@example.com',
    firstName: 'Juan',
    lastName: 'García',
    password: 'password123',
    role: 'customer' as const,
  };

  it('accepts valid user data', () => {
    expect(createUserSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts user without optional fields', () => {
    const { password: _, role: __, ...minimal } = validData;
    expect(createUserSchema.safeParse(minimal).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createUserSchema.safeParse({
      ...validData,
      email: 'bad-email',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects empty firstName', () => {
    const result = createUserSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.firstName).toBeDefined();
  });

  it('rejects empty lastName', () => {
    const result = createUserSchema.safeParse({ ...validData, lastName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = createUserSchema.safeParse({
      ...validData,
      password: 'short1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid role', () => {
    const result = createUserSchema.safeParse({
      ...validData,
      role: 'superadmin',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid roles', () => {
    const roles = ['admin', 'customer', 'staff'] as const;
    for (const role of roles) {
      expect(createUserSchema.safeParse({ ...validData, role }).success).toBe(
        true
      );
    }
  });
});

describe('updateUserSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    expect(updateUserSchema.safeParse({}).success).toBe(true);
  });

  it('accepts partial update with only email', () => {
    expect(
      updateUserSchema.safeParse({ email: 'new@example.com' }).success
    ).toBe(true);
  });

  it('rejects invalid email in partial update', () => {
    const result = updateUserSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('accepts isActive boolean', () => {
    expect(updateUserSchema.safeParse({ isActive: false }).success).toBe(true);
  });

  it('accepts null phone', () => {
    expect(updateUserSchema.safeParse({ phone: null }).success).toBe(true);
  });
});

describe('createUserFormSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'Password123!',
    firstName: 'Juan',
    lastName: 'García',
    phone: '+51 999 888 777',
    dateOfBirth: '1990-05-15',
    role: 'customer' as const,
    isActive: true,
  };

  it('accepts valid form data', () => {
    expect(createUserFormSchema.safeParse(validData).success).toBe(true);
  });

  it('accepts form without optional phone and dateOfBirth', () => {
    const { phone: _, dateOfBirth: __, ...minimal } = validData;
    expect(createUserFormSchema.safeParse(minimal).success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = createUserFormSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects invalid email format', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      password: '',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });

  it('rejects password shorter than 8 characters', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      password: 'short1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty firstName', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      firstName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty lastName', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      lastName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects future dateOfBirth', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      dateOfBirth: '2099-01-01',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.dateOfBirth).toBeDefined();
  });

  it('rejects dateOfBirth before 1900', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      dateOfBirth: '1899-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid dateOfBirth format', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      dateOfBirth: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('accepts null dateOfBirth', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      dateOfBirth: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid role', () => {
    const result = createUserFormSchema.safeParse({
      ...validData,
      role: 'superadmin' as never,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing role', () => {
    const { role: _, ...noRole } = validData;
    expect(createUserFormSchema.safeParse(noRole).success).toBe(false);
  });
});
