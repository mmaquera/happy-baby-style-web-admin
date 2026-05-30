export type { Result, Ok, Err } from './Result';
export {
  ok,
  err,
  isOk,
  isErr,
  DomainError,
  NotFoundError,
  ValidationError,
} from './Result';

export { productSchema, updateProductSchema } from './validation/productSchema';
export type {
  ProductSchemaInput,
  UpdateProductSchemaInput,
} from './validation/productSchema';

export {
  categorySchema,
  updateCategorySchema,
  createCategoryFormSchema,
} from './validation/categorySchema';
export type {
  CategorySchemaInput,
  UpdateCategorySchemaInput,
  CreateCategoryFormData,
} from './validation/categorySchema';

export {
  createUserSchema,
  updateUserSchema,
  createUserFormSchema,
} from './validation/userSchema';
export type {
  CreateUserFormData,
  UpdateUserFormData,
  CreateUserFormValues,
} from './validation/userSchema';

export { loginSchema, registerSchema } from './validation/authSchema';
export type { LoginFormData, RegisterFormData } from './validation/authSchema';
