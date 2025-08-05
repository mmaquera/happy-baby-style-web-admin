import { Pool } from 'pg';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { 
  User, 
  UserProfile, 
  UserAddress, 
  UserRole, 
  UserStats, 
  CreateUserRequest, 
  UpdateUserRequest, 
  CreateUserAddressRequest, 
  UpdateUserAddressRequest,
  UserEntity,
  UserProfileEntity,
  UserAddressEntity
} from '../../domain/entities/User';

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  // User operations
  async createUser(data: CreateUserRequest): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create user in auth.users (this would typically be done by Supabase Auth)
      // For now, we'll create a basic user record
      const userResult = await client.query(
        `INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, created_at, updated_at`,
        [
          crypto.randomUUID(),
          data.email,
          data.password, // In real implementation, this should be hashed
          new Date(),
          new Date(),
          new Date()
        ]
      );

      const user = userResult.rows[0];
      
      // Create user profile if provided
      let profile: UserProfile | undefined;
      if (data.profile) {
        const profileResult = await client.query(
          `INSERT INTO user_profiles (user_id, first_name, last_name, phone, birth_date)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            user.id,
            data.profile.firstName,
            data.profile.lastName,
            data.profile.phone,
            data.profile.birthDate
          ]
        );
        profile = this.mapToUserProfile(profileResult.rows[0]);
      }

      await client.query('COMMIT');

      return new UserEntity(
        user.id,
        user.email,
        data.role || UserRole.CUSTOMER,
        true,
        true,
        profile ? new UserProfileEntity(
          profile.id,
          profile.userId,
          profile.firstName,
          profile.lastName,
          profile.phone,
          profile.birthDate,
          profile.avatarUrl,
          profile.createdAt,
          profile.updatedAt
        ) : undefined,
        [],
        user.created_at,
        user.updated_at
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUsers(limit = 50, offset = 0, role?: UserRole, isActive?: boolean): Promise<User[]> {
    let query = `
      SELECT u.id, u.email, u.created_at, u.updated_at,
             up.id as profile_id, up.first_name, up.last_name, up.phone, up.birth_date, up.avatar_url,
             up.created_at as profile_created_at, up.updated_at as profile_updated_at
      FROM auth.users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND u.role = $${paramIndex++}`;
      params.push(role);
    }

    if (isActive !== undefined) {
      query += ` AND u.confirmed_at IS NOT NULL`;
    }

    query += ` ORDER BY u.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await this.pool.query(query, params);
    
    return result.rows.map(row => this.mapToUser(row));
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT u.id, u.email, u.created_at, u.updated_at,
              up.id as profile_id, up.first_name, up.last_name, up.phone, up.birth_date, up.avatar_url,
              up.created_at as profile_created_at, up.updated_at as profile_updated_at
       FROM auth.users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    
    const user = this.mapToUser(result.rows[0]);
    
    // Get addresses
    const addressesResult = await this.pool.query(
      'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
      [id]
    );
    
    user.addresses = addressesResult.rows.map(row => this.mapToUserAddress(row));
    
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT u.id, u.email, u.created_at, u.updated_at,
              up.id as profile_id, up.first_name, up.last_name, up.phone, up.birth_date, up.avatar_url,
              up.created_at as profile_created_at, up.updated_at as profile_updated_at
       FROM auth.users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) return null;
    
    return this.mapToUser(result.rows[0]);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user
      if (data.email) {
        await client.query(
          'UPDATE auth.users SET email = $1, updated_at = $2 WHERE id = $3',
          [data.email, new Date(), id]
        );
      }

      // Update profile if provided
      if (data.profile) {
        await this.updateUserProfile(id, data.profile);
      }

      await client.query('COMMIT');
      
      return await this.getUserById(id) as User;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUser(id: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete addresses
      await client.query('DELETE FROM user_addresses WHERE user_id = $1', [id]);
      
      // Delete profile
      await client.query('DELETE FROM user_profiles WHERE user_id = $1', [id]);
      
      // Delete user (in real implementation, you might want to soft delete)
      await client.query('DELETE FROM auth.users WHERE id = $1', [id]);
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserStats(): Promise<UserStats> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN confirmed_at IS NOT NULL THEN 1 END) as active_users,
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as new_users_this_month
      FROM auth.users
    `);

    const stats = result.rows[0];
    
    // Get users by role (simplified - in real implementation you'd have a role field)
    const roleStats = {
      [UserRole.ADMIN]: 0,
      [UserRole.CUSTOMER]: parseInt(stats.total_users),
      [UserRole.STAFF]: 0
    };

    return {
      totalUsers: parseInt(stats.total_users),
      activeUsers: parseInt(stats.active_users),
      newUsersThisMonth: parseInt(stats.new_users_this_month),
      usersByRole: roleStats
    };
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    // Simplified implementation - in real scenario you'd filter by role
    return this.getUsers(100, 0, role);
  }

  async getActiveUsers(): Promise<User[]> {
    return this.getUsers(100, 0, undefined, true);
  }

  async searchUsers(query: string): Promise<User[]> {
    const result = await this.pool.query(
      `SELECT u.id, u.email, u.created_at, u.updated_at,
              up.id as profile_id, up.first_name, up.last_name, up.phone, up.birth_date, up.avatar_url,
              up.created_at as profile_created_at, up.updated_at as profile_updated_at
       FROM auth.users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.email ILIKE $1 OR up.first_name ILIKE $1 OR up.last_name ILIKE $1
       ORDER BY u.created_at DESC`,
      [`%${query}%`]
    );

    return result.rows.map(row => this.mapToUser(row));
  }

  // User profile operations
  async createUserProfile(userId: string, profile: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const result = await this.pool.query(
      `INSERT INTO user_profiles (user_id, first_name, last_name, phone, birth_date, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        profile.firstName,
        profile.lastName,
        profile.phone,
        profile.birthDate,
        profile.avatarUrl
      ]
    );

    return this.mapToUserProfile(result.rows[0]);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) return null;
    
    return this.mapToUserProfile(result.rows[0]);
  }

  async updateUserProfile(userId: string, profile: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (profile.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(profile.firstName);
    }
    if (profile.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(profile.lastName);
    }
    if (profile.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(profile.phone);
    }
    if (profile.birthDate !== undefined) {
      fields.push(`birth_date = $${paramIndex++}`);
      values.push(profile.birthDate);
    }
    if (profile.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(profile.avatarUrl);
    }

    fields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    values.push(userId);

    const result = await this.pool.query(
      `UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
      values
    );

    return this.mapToUserProfile(result.rows[0]);
  }

  async deleteUserProfile(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM user_profiles WHERE user_id = $1', [userId]);
  }

  // User address operations
  async createUserAddress(data: CreateUserAddressRequest): Promise<UserAddress> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // If this is the default address, unset other defaults
      if (data.isDefault) {
        await client.query(
          'UPDATE user_addresses SET is_default = false WHERE user_id = $1',
          [data.userId]
        );
      }

      const result = await client.query(
        `INSERT INTO user_addresses (user_id, title, first_name, last_name, address_line_1, address_line_2, city, state, postal_code, country, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          data.userId,
          data.title,
          data.firstName,
          data.lastName,
          data.addressLine1,
          data.addressLine2,
          data.city,
          data.state,
          data.postalCode,
          data.country || 'Perú',
          data.isDefault || false
        ]
      );

      await client.query('COMMIT');
      return this.mapToUserAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    const result = await this.pool.query(
      'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
      [userId]
    );

    return result.rows.map(row => this.mapToUserAddress(row));
  }

  async getUserAddressById(id: string): Promise<UserAddress | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_addresses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;
    
    return this.mapToUserAddress(result.rows[0]);
  }

  async updateUserAddress(id: string, data: UpdateUserAddressRequest): Promise<UserAddress> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (data.title !== undefined) {
        fields.push(`title = $${paramIndex++}`);
        values.push(data.title);
      }
      if (data.firstName !== undefined) {
        fields.push(`first_name = $${paramIndex++}`);
        values.push(data.firstName);
      }
      if (data.lastName !== undefined) {
        fields.push(`last_name = $${paramIndex++}`);
        values.push(data.lastName);
      }
      if (data.addressLine1 !== undefined) {
        fields.push(`address_line_1 = $${paramIndex++}`);
        values.push(data.addressLine1);
      }
      if (data.addressLine2 !== undefined) {
        fields.push(`address_line_2 = $${paramIndex++}`);
        values.push(data.addressLine2);
      }
      if (data.city !== undefined) {
        fields.push(`city = $${paramIndex++}`);
        values.push(data.city);
      }
      if (data.state !== undefined) {
        fields.push(`state = $${paramIndex++}`);
        values.push(data.state);
      }
      if (data.postalCode !== undefined) {
        fields.push(`postal_code = $${paramIndex++}`);
        values.push(data.postalCode);
      }
      if (data.country !== undefined) {
        fields.push(`country = $${paramIndex++}`);
        values.push(data.country);
      }
      if (data.isDefault !== undefined) {
        fields.push(`is_default = $${paramIndex++}`);
        values.push(data.isDefault);
        
        // If setting as default, unset other defaults
        if (data.isDefault) {
          const addressResult = await client.query(
            'SELECT user_id FROM user_addresses WHERE id = $1',
            [id]
          );
          
          if (addressResult.rows.length > 0) {
            await client.query(
              'UPDATE user_addresses SET is_default = false WHERE user_id = $1 AND id != $2',
              [addressResult.rows[0].user_id, id]
            );
          }
        }
      }

      fields.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const result = await client.query(
        `UPDATE user_addresses SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      await client.query('COMMIT');
      return this.mapToUserAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUserAddress(id: string): Promise<void> {
    await this.pool.query('DELETE FROM user_addresses WHERE id = $1', [id]);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Unset all defaults for this user
      await client.query(
        'UPDATE user_addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
      
      // Set the specified address as default
      await client.query(
        'UPDATE user_addresses SET is_default = true WHERE id = $1 AND user_id = $2',
        [addressId, userId]
      );
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getDefaultAddress(userId: string): Promise<UserAddress | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) return null;
    
    return this.mapToUserAddress(result.rows[0]);
  }

  // Helper methods for mapping
  private mapToUser(row: any): User {
    const profile = row.profile_id ? new UserProfileEntity(
      row.profile_id,
      row.id,
      row.first_name,
      row.last_name,
      row.phone,
      row.birth_date ? new Date(row.birth_date) : undefined,
      row.avatar_url,
      row.profile_created_at,
      row.profile_updated_at
    ) : undefined;

    return new UserEntity(
      row.id,
      row.email,
      UserRole.CUSTOMER, // Default role - in real implementation this would come from the database
      true, // Default active - in real implementation this would come from confirmed_at
      true, // Default email verified - in real implementation this would come from email_confirmed_at
      profile,
      [],
      row.created_at,
      row.updated_at
    );
  }

  private mapToUserProfile(row: any): UserProfile {
    return new UserProfileEntity(
      row.id,
      row.user_id,
      row.first_name,
      row.last_name,
      row.phone,
      row.birth_date ? new Date(row.birth_date) : undefined,
      row.avatar_url,
      row.created_at,
      row.updated_at
    );
  }

  private mapToUserAddress(row: any): UserAddress {
    return new UserAddressEntity(
      row.id,
      row.user_id,
      row.title,
      row.first_name,
      row.last_name,
      row.address_line_1,
      row.address_line_2,
      row.city,
      row.state,
      row.postal_code,
      row.country,
      row.is_default,
      row.created_at,
      row.updated_at
    );
  }
} 