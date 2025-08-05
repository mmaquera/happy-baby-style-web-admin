import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreateUserRequest, User } from '../../../domain/entities/User';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserRequest): Promise<User> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate profile data if provided
    if (data.profile) {
      if (!data.profile.firstName || !data.profile.lastName) {
        throw new Error('First name and last name are required');
      }

      if (data.profile.firstName.length < 2) {
        throw new Error('First name must be at least 2 characters long');
      }

      if (data.profile.lastName.length < 2) {
        throw new Error('Last name must be at least 2 characters long');
      }

      // Validate phone number if provided
      if (data.profile.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.profile.phone.replace(/\s/g, ''))) {
          throw new Error('Invalid phone number format');
        }
      }

      // Validate birth date if provided
      if (data.profile.birthDate) {
        const birthDate = new Date(data.profile.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 13 || age > 120) {
          throw new Error('Birth date must be for a person between 13 and 120 years old');
        }
      }
    }

    // Create user
    const user = await this.userRepository.createUser(data);
    
    return user;
  }
} 