import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateCategoryUseCase } from '../UpdateCategoryUseCase';
import { createMockRepository, MOCK_CATEGORY } from './fixtures';
import { isOk, isErr } from '@/core/shared/Result';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let repo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new UpdateCategoryUseCase(repo);
  });

  it('actualiza categoría con datos válidos', async () => {
    const result = await useCase.execute('cat-1', { name: 'Nuevo Nombre' });
    expect(isOk(result)).toBe(true);
    expect(repo.update).toHaveBeenCalledWith(
      'cat-1',
      expect.objectContaining({ name: 'Nuevo Nombre' })
    );
  });

  it('falla si el id está vacío', async () => {
    const result = await useCase.execute('', { name: 'Test' });
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.message).toContain('requerido');
  });

  it('falla si el id es sólo espacios', async () => {
    const result = await useCase.execute('   ', { name: 'Test' });
    expect(isErr(result)).toBe(true);
  });

  it('falla si el nombre supera 200 caracteres', async () => {
    const result = await useCase.execute('cat-1', { name: 'a'.repeat(201) });
    expect(isErr(result)).toBe(true);
  });

  it('acepta input parcial (sólo isActive)', async () => {
    const result = await useCase.execute('cat-1', { isActive: false });
    expect(isOk(result)).toBe(true);
  });

  it('devuelve la categoría actualizada', async () => {
    const updated = { ...MOCK_CATEGORY, name: 'Actualizado' };
    repo.update.mockResolvedValueOnce({ ok: true, value: updated });
    const result = await useCase.execute('cat-1', { name: 'Actualizado' });
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value.name).toBe('Actualizado');
  });

  it('falla si la URL de imagen es inválida', async () => {
    const result = await useCase.execute('cat-1', { image: 'invalid-url' });
    expect(isErr(result)).toBe(true);
  });
});
