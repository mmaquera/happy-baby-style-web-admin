import { CreateProductUseCase } from '@happy-baby/application-product';
import { isOk, isErr, ok } from '@happy-baby/domain-shared';
import { ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository, MOCK_PRODUCT } from './fixtures';

describe('CreateProductUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    const useCase = new CreateProductUseCase(repo);
    return { useCase, repo };
  };

  const validInput = {
    name: 'Body Orgánico',
    sku: 'BODY-001',
    price: 100,
    stockQuantity: 5,
    isActive: true,
    images: [],
    tags: [],
    attributes: {},
  };

  it('returns ok(product) for valid input', async () => {
    const { useCase, repo } = makeUseCase();
    repo.create.mockResolvedValueOnce(ok(MOCK_PRODUCT));

    const result = await useCase.execute(validInput);

    expect(isOk(result)).toBe(true);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('passes validated data to repository (not raw input)', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute(validInput);

    const [passedInput] = repo.create.mock.calls[0]!;
    expect(passedInput.name).toBe('Body Orgánico');
    expect(passedInput.sku).toBe('BODY-001');
    expect(passedInput.price).toBe(100);
  });

  it('returns err(ValidationError) when name is empty', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({ ...validInput, name: '' });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect((result.error as ValidationError).fields?.['name']).toBeDefined();
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when price is zero', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({ ...validInput, price: 0 });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect((result.error as ValidationError).fields?.['price']).toBeDefined();
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when price is negative', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({ ...validInput, price: -10 });

    expect(isErr(result)).toBe(true);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when salePrice >= price', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({
      ...validInput,
      price: 100,
      salePrice: 100,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(
        (result.error as ValidationError).fields?.['salePrice']
      ).toBeDefined();
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) when SKU has invalid characters', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({
      ...validInput,
      sku: 'invalid sku!',
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect((result.error as ValidationError).fields?.['sku']).toBeDefined();
    }
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('allows salePrice < price', async () => {
    const { useCase, repo } = makeUseCase();

    const result = await useCase.execute({
      ...validInput,
      price: 100,
      salePrice: 80,
    });

    expect(isOk(result)).toBe(true);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    const repoError = new Error('DB error');
    repo.create.mockResolvedValueOnce({ ok: false, error: repoError });

    const result = await useCase.execute(validInput);

    expect(isErr(result)).toBe(true);
  });
});
