import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterUser } from './useRegisterUser';
import {
  registerSchema,
  type RegisterFormData,
} from '@happy-baby/domain-shared';
import { UserRole } from '@/generated/graphql';

export interface UseRegisterFormReturn {
  form: ReturnType<typeof useForm<RegisterFormData>>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  role: UserRole;
  isActive: boolean;
  dateOfBirth: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
  setRole: (role: UserRole) => void;
  setIsActive: (v: boolean) => void;
  setDateOfBirth: (v: string) => void;
  clearError: () => void;
}

const defaultValues: RegisterFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
};

export const useRegisterForm = (
  onSuccess?: () => void
): UseRegisterFormReturn => {
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.customer);
  const [isActive, setIsActive] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handleSubmit = useCallback(
    async (data: RegisterFormData) => {
      clearError();
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? '',
        dateOfBirth: dateOfBirth || null,
        role,
        isActive,
      });
      if (result) {
        setSuccess(true);
        form.reset();
        setDateOfBirth('');
        setRole(UserRole.customer);
        setIsActive(true);
        onSuccess?.();
      }
    },
    [registerUser, clearError, form, role, isActive, dateOfBirth, onSuccess]
  );

  const togglePassword = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleConfirmPassword = useCallback(
    () => setShowConfirmPassword(prev => !prev),
    []
  );

  return {
    form,
    isLoading,
    error,
    success,
    showPassword,
    showConfirmPassword,
    role,
    isActive,
    dateOfBirth,
    onSubmit: form.handleSubmit(handleSubmit),
    togglePassword,
    toggleConfirmPassword,
    setRole,
    setIsActive,
    setDateOfBirth,
    clearError,
  };
};
