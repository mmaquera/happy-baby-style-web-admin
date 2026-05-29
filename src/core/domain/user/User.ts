export type UserRole = 'admin' | 'customer' | 'staff';

export interface UserAddress {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  fullName: string;
  fullAddress: string;
}

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  avatar: string | null;
  fullName: string | null;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  profile: UserProfile | null;
  addresses: UserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  phone?: string | null;
  password?: string;
}

export interface UpdateUserInput {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface UserFilter {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserPage {
  items: User[];
  total: number;
  hasMore: boolean;
}
