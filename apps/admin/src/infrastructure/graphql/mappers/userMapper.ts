import type {
  User,
  UserProfile,
  UserAddress,
  CreateUserInput,
  UpdateUserInput,
  UserRole,
} from '@happy-baby/domain-user';
import { UserRole as GQLUserRole } from '@/generated/graphql';

// Minimal address shape returned by any query (subset of full GQLUserAddress)
interface UserAddressDTO {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
  fullName: string;
  fullAddress: string;
}

// Minimal profile shape returned by any query (subset of full GQLUserProfile)
interface UserProfileDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  avatar?: string | null;
  fullName?: string | null;
}

// Minimal DTO shape accepted from any query/mutation returning user data
export interface UserDTO {
  id: string;
  email: string;
  role: GQLUserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfileDTO | null;
  addresses?: UserAddressDTO[];
}

function toUserRole(role: GQLUserRole): UserRole {
  const map: Record<GQLUserRole, UserRole> = {
    [GQLUserRole.admin]: 'admin',
    [GQLUserRole.customer]: 'customer',
    [GQLUserRole.staff]: 'staff',
  };
  return map[role] ?? 'customer';
}

function toUserProfile(gql: UserProfileDTO): UserProfile {
  return {
    id: gql.id,
    firstName: gql.firstName ?? null,
    lastName: gql.lastName ?? null,
    phone: gql.phone ?? null,
    dateOfBirth: gql.dateOfBirth ?? null,
    avatar: gql.avatar ?? null,
    fullName: gql.fullName ?? null,
  };
}

function toUserAddress(gql: UserAddressDTO): UserAddress {
  return {
    id: gql.id,
    type: gql.type,
    firstName: gql.firstName,
    lastName: gql.lastName,
    company: gql.company ?? null,
    address1: gql.address1,
    address2: gql.address2 ?? null,
    city: gql.city,
    state: gql.state,
    postalCode: gql.postalCode,
    country: gql.country,
    phone: gql.phone ?? null,
    isDefault: gql.isDefault,
    fullName: gql.fullName,
    fullAddress: gql.fullAddress,
  };
}

function toDomain(dto: UserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    role: toUserRole(dto.role),
    isActive: dto.isActive,
    emailVerified: dto.emailVerified,
    lastLoginAt: dto.lastLoginAt ? new Date(dto.lastLoginAt) : null,
    profile: dto.profile ? toUserProfile(dto.profile) : null,
    addresses: (dto.addresses ?? []).map(toUserAddress),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

function toGQLRole(role: UserRole): GQLUserRole {
  const map: Record<UserRole, GQLUserRole> = {
    admin: GQLUserRole.admin,
    customer: GQLUserRole.customer,
    staff: GQLUserRole.staff,
  };
  return map[role];
}

function toCreateDTO(input: CreateUserInput) {
  return {
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone ?? null,
    password: input.password ?? null,
    role: input.role ? toGQLRole(input.role) : null,
  };
}

function toUpdateDTO(input: UpdateUserInput) {
  return {
    email: input.email ?? null,
    role: input.role ? toGQLRole(input.role) : null,
    isActive: input.isActive ?? null,
  };
}

export const userMapper = { toDomain, toCreateDTO, toUpdateDTO, toGQLRole };
