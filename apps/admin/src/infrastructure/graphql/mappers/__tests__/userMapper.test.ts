import { userMapper, type UserDTO } from '@happy-baby/infrastructure-graphql';
import { UserRole as GQLUserRole } from '@happy-baby/infrastructure-graphql';

const BASE_DTO: UserDTO = {
  id: 'user-1',
  email: 'ana@example.com',
  role: GQLUserRole.customer,
  isActive: true,
  emailVerified: true,
  lastLoginAt: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

describe('userMapper.toDomain', () => {
  it('maps scalar fields correctly', () => {
    const user = userMapper.toDomain(BASE_DTO);
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('ana@example.com');
    expect(user.isActive).toBe(true);
    expect(user.emailVerified).toBe(true);
  });

  it('maps GQL role enum to domain string', () => {
    const admin = userMapper.toDomain({ ...BASE_DTO, role: GQLUserRole.admin });
    const staff = userMapper.toDomain({ ...BASE_DTO, role: GQLUserRole.staff });
    const customer = userMapper.toDomain({
      ...BASE_DTO,
      role: GQLUserRole.customer,
    });

    expect(admin.role).toBe('admin');
    expect(staff.role).toBe('staff');
    expect(customer.role).toBe('customer');
  });

  it('converts createdAt and updatedAt strings to Date', () => {
    const user = userMapper.toDomain(BASE_DTO);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('maps lastLoginAt string to Date when present', () => {
    const user = userMapper.toDomain({
      ...BASE_DTO,
      lastLoginAt: '2024-01-15T10:00:00Z',
    });
    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(user.lastLoginAt?.toISOString()).toBe('2024-01-15T10:00:00.000Z');
  });

  it('sets lastLoginAt to null when absent', () => {
    const user = userMapper.toDomain(BASE_DTO);
    expect(user.lastLoginAt).toBeNull();
  });

  it('maps profile when present', () => {
    const dto: UserDTO = {
      ...BASE_DTO,
      profile: {
        id: 'profile-1',
        firstName: 'Ana',
        lastName: 'García',
        phone: '+573001234567',
        dateOfBirth: '1990-05-15',
        avatar: null,
        fullName: 'Ana García',
      },
    };
    const user = userMapper.toDomain(dto);
    expect(user.profile).not.toBeNull();
    expect(user.profile?.firstName).toBe('Ana');
    expect(user.profile?.lastName).toBe('García');
    expect(user.profile?.phone).toBe('+573001234567');
    expect(user.profile?.fullName).toBe('Ana García');
  });

  it('sets profile to null when absent', () => {
    const user = userMapper.toDomain(BASE_DTO);
    expect(user.profile).toBeNull();
  });

  it('maps profile.phone to null when missing', () => {
    const dto: UserDTO = {
      ...BASE_DTO,
      profile: {
        id: 'p-1',
        firstName: 'X',
        lastName: 'Y',
        fullName: 'X Y',
      },
    };
    const user = userMapper.toDomain(dto);
    expect(user.profile?.phone).toBeNull();
  });

  it('maps addresses when present', () => {
    const dto: UserDTO = {
      ...BASE_DTO,
      addresses: [
        {
          id: 'addr-1',
          type: 'home',
          firstName: 'Ana',
          lastName: 'García',
          company: null,
          address1: 'Calle 123 #45-67',
          address2: null,
          city: 'Bogotá',
          state: 'Cundinamarca',
          postalCode: '110111',
          country: 'CO',
          phone: null,
          isDefault: true,
          fullName: 'Ana García',
          fullAddress: 'Calle 123 #45-67, Bogotá',
        },
      ],
    };
    const user = userMapper.toDomain(dto);
    expect(user.addresses).toHaveLength(1);
    expect(user.addresses[0]!.address1).toBe('Calle 123 #45-67');
    expect(user.addresses[0]!.city).toBe('Bogotá');
    expect(user.addresses[0]!.isDefault).toBe(true);
  });

  it('defaults addresses to empty array when absent', () => {
    const user = userMapper.toDomain({
      ...BASE_DTO,
      addresses: undefined,
    } as unknown as UserDTO);
    expect(user.addresses).toEqual([]);
  });
});

describe('userMapper.toGQLRole', () => {
  it('maps domain role strings to GQL enum', () => {
    expect(userMapper.toGQLRole('admin')).toBe(GQLUserRole.admin);
    expect(userMapper.toGQLRole('customer')).toBe(GQLUserRole.customer);
    expect(userMapper.toGQLRole('staff')).toBe(GQLUserRole.staff);
  });
});

describe('userMapper.toCreateDTO', () => {
  it('maps required fields', () => {
    const dto = userMapper.toCreateDTO({
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
    });
    expect(dto.email).toBe('x@x.com');
    expect(dto.firstName).toBe('X');
    expect(dto.lastName).toBe('Y');
  });

  it('converts role to GQL enum', () => {
    const dto = userMapper.toCreateDTO({
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
      role: 'admin',
    });
    expect(dto.role).toBe(GQLUserRole.admin);
  });

  it('sets role to null when absent', () => {
    const dto = userMapper.toCreateDTO({
      email: 'x@x.com',
      firstName: 'X',
      lastName: 'Y',
    });
    expect(dto.role).toBeNull();
  });
});

describe('userMapper.toUpdateDTO', () => {
  it('converts role to GQL enum', () => {
    const dto = userMapper.toUpdateDTO({ role: 'staff' });
    expect(dto.role).toBe(GQLUserRole.staff);
  });

  it('sets role null when absent', () => {
    const dto = userMapper.toUpdateDTO({ isActive: false });
    expect(dto.role).toBeNull();
  });

  it('passes isActive through', () => {
    const dto = userMapper.toUpdateDTO({ isActive: false });
    expect(dto.isActive).toBe(false);
  });
});
