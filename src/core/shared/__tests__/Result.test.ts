import {
  ok,
  err,
  isOk,
  isErr,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../Result';

describe('ok', () => {
  it('creates an Ok result with the value', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(42);
  });

  it('works with string values', () => {
    const result = ok('hello');
    expect(result.value).toBe('hello');
  });

  it('works with object values', () => {
    const value = { id: '1', name: 'Test' };
    const result = ok(value);
    expect(result.value).toBe(value);
  });

  it('works with null', () => {
    const result = ok(null);
    expect(result.value).toBeNull();
  });
});

describe('err', () => {
  it('creates an Err result with the error', () => {
    const error = new Error('Something went wrong');
    const result = err(error);
    expect(result.ok).toBe(false);
    expect(result.error).toBe(error);
  });

  it('works with string errors', () => {
    const result = err('error message');
    expect(result.error).toBe('error message');
  });
});

describe('isOk', () => {
  it('returns true for Ok results', () => {
    expect(isOk(ok(1))).toBe(true);
  });

  it('returns false for Err results', () => {
    expect(isOk(err(new Error()))).toBe(false);
  });

  it('narrows type to Ok', () => {
    const result = ok('value');
    if (isOk(result)) {
      expect(result.value).toBe('value');
    }
  });
});

describe('isErr', () => {
  it('returns true for Err results', () => {
    expect(isErr(err(new Error()))).toBe(true);
  });

  it('returns false for Ok results', () => {
    expect(isErr(ok(1))).toBe(false);
  });

  it('narrows type to Err', () => {
    const error = new Error('fail');
    const result = err(error);
    if (isErr(result)) {
      expect(result.error).toBe(error);
    }
  });
});

describe('DomainError', () => {
  it('creates error with message and code', () => {
    const error = new DomainError('Something failed', 'SOME_CODE');
    expect(error.message).toBe('Something failed');
    expect(error.code).toBe('SOME_CODE');
    expect(error.name).toBe('DomainError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('creates a not found error with correct message', () => {
    const error = new NotFoundError('Product', 'prod-123');
    expect(error.message).toBe('Product with id "prod-123" not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.name).toBe('NotFoundError');
    expect(error).toBeInstanceOf(DomainError);
  });
});

describe('ValidationError', () => {
  it('creates a validation error with message', () => {
    const error = new ValidationError('Datos inválidos');
    expect(error.message).toBe('Datos inválidos');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(DomainError);
  });

  it('stores field errors', () => {
    const fields = { name: ['requerido'], price: ['debe ser positivo'] };
    const error = new ValidationError('Validación fallida', fields);
    expect(error.fields).toEqual(fields);
  });

  it('accepts no fields argument', () => {
    const error = new ValidationError('Error');
    expect(error.fields).toBeUndefined();
  });
});
