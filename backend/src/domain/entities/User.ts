export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly lastLogin: Date | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): UserEntity {
    const now = new Date();
    return new UserEntity(
      crypto.randomUUID(),
      data.email,
      data.name,
      data.role,
      data.isActive,
      undefined,
      now,
      now
    );
  }

  update(data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): UserEntity {
    return new UserEntity(
      this.id,
      data.email ?? this.email,
      data.name ?? this.name,
      data.role ?? this.role,
      data.isActive ?? this.isActive,
      data.lastLogin ?? this.lastLogin,
      this.createdAt,
      new Date()
    );
  }

  updateLastLogin(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.name,
      this.role,
      this.isActive,
      new Date(),
      this.createdAt,
      new Date()
    );
  }

  hasPermission(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.VIEWER]: 1,
      [UserRole.MANAGER]: 2,
      [UserRole.ADMIN]: 3,
      [UserRole.SUPER_ADMIN]: 4
    };

    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }
}