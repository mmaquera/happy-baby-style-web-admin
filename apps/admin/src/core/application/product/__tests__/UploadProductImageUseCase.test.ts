import { UploadProductImageUseCase } from '@happy-baby/application-product';
import { isOk, isErr, ok } from '@happy-baby/domain-shared';
import { ValidationError } from '@happy-baby/domain-shared';
import { createMockRepository } from './fixtures';

const makeFile = (name: string, type: string, sizeBytes: number): File => {
  const content = new Array(sizeBytes).fill('a').join('');
  return new File([content], name, { type });
};

describe('UploadProductImageUseCase', () => {
  const makeUseCase = () => {
    const repo = createMockRepository();
    const useCase = new UploadProductImageUseCase(repo);
    return { useCase, repo };
  };

  it('returns ok(url) for valid JPEG under 5 MB', async () => {
    const { useCase, repo } = makeUseCase();
    const file = makeFile('photo.jpg', 'image/jpeg', 1024);
    repo.uploadImage.mockResolvedValueOnce(
      ok('https://cdn.example.com/photo.jpg')
    );

    const result = await useCase.execute(file, 'prod-1');

    expect(isOk(result)).toBe(true);
    if (isOk(result))
      expect(result.value).toBe('https://cdn.example.com/photo.jpg');
    expect(repo.uploadImage).toHaveBeenCalledWith(file, 'prod-1');
  });

  it('returns ok(url) for valid PNG', async () => {
    const { useCase } = makeUseCase();
    const file = makeFile('image.png', 'image/png', 512);

    const result = await useCase.execute(file, 'prod-1');

    expect(isOk(result)).toBe(true);
  });

  it('returns ok(url) for valid WebP', async () => {
    const { useCase } = makeUseCase();
    const file = makeFile('image.webp', 'image/webp', 512);

    const result = await useCase.execute(file, 'prod-1');

    expect(isOk(result)).toBe(true);
  });

  it('returns err(ValidationError) when file exceeds 5 MB', async () => {
    const { useCase, repo } = makeUseCase();
    const fiveMBplusOne = 5 * 1024 * 1024 + 1;
    const file = makeFile('big.jpg', 'image/jpeg', fiveMBplusOne);

    const result = await useCase.execute(file, 'prod-1');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toMatch(/5MB/);
    }
    expect(repo.uploadImage).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for unsupported type (PDF)', async () => {
    const { useCase, repo } = makeUseCase();
    const file = makeFile('doc.pdf', 'application/pdf', 100);

    const result = await useCase.execute(file, 'prod-1');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toMatch(/soportado/i);
    }
    expect(repo.uploadImage).not.toHaveBeenCalled();
  });

  it('returns err(ValidationError) for GIF (unsupported)', async () => {
    const { useCase, repo } = makeUseCase();
    const file = makeFile('anim.gif', 'image/gif', 100);

    const result = await useCase.execute(file, 'prod-1');

    expect(isErr(result)).toBe(true);
    expect(repo.uploadImage).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const { useCase, repo } = makeUseCase();
    const file = makeFile('ok.jpg', 'image/jpeg', 100);
    repo.uploadImage.mockResolvedValueOnce({
      ok: false,
      error: new Error('S3 error'),
    });

    const result = await useCase.execute(file, 'prod-1');

    expect(isErr(result)).toBe(true);
  });
});
