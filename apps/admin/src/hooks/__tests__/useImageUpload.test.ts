import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '@happy-baby/feature-products';

const mockUploadMutate = vi.fn();

vi.mock('@happy-baby/infrastructure-graphql', () => ({
  useUploadImageMutation: () => [mockUploadMutate, { loading: false }],
}));

const makeFileList = (names: string[]): FileList => {
  const files = names.map(
    name => new File(['content'], name, { type: 'image/jpeg' })
  );
  const fileList = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: function* () {
      yield* files;
    },
  };
  files.forEach((f, i) => Object.defineProperty(fileList, i, { value: f }));
  return fileList as unknown as FileList;
};

const successResponse = (url = 'https://cdn.example.com/img.jpg') => ({
  data: {
    uploadImage: {
      success: true,
      message: 'Upload exitoso',
      data: { url, filename: 'img.jpg', imageId: 'img-1' },
    },
  },
});

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.loading).toBe(false);
    expect(result.current.progress).toEqual({
      current: 0,
      total: 0,
      percentage: 0,
    });
    expect(result.current.error).toBeNull();
  });

  describe('upload', () => {
    it('returns success result with url on successful single upload', async () => {
      mockUploadMutate.mockResolvedValue(successResponse());
      const { result } = renderHook(() => useImageUpload());

      let uploadResult:
        | Awaited<ReturnType<typeof result.current.upload>>
        | undefined;
      await act(async () => {
        uploadResult = await result.current.upload(makeFileList(['test.jpg']));
      });

      expect(uploadResult?.success).toBe(true);
      expect(uploadResult?.url).toBe('https://cdn.example.com/img.jpg');
    });

    it('calls mutation with entityId and entityType when provided', async () => {
      mockUploadMutate.mockResolvedValue(successResponse());
      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.upload(
          makeFileList(['img.jpg']),
          'product-1',
          'product'
        );
      });

      expect(mockUploadMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            entityId: 'product-1',
            entityType: 'product',
          }),
        })
      );
    });

    it('returns failure result when server responds success=false', async () => {
      mockUploadMutate.mockResolvedValue({
        data: {
          uploadImage: {
            success: false,
            message: 'Tipo no permitido',
            data: null,
          },
        },
      });
      const { result } = renderHook(() => useImageUpload());

      let uploadResult:
        | Awaited<ReturnType<typeof result.current.upload>>
        | undefined;
      await act(async () => {
        uploadResult = await result.current.upload(makeFileList(['doc.pdf']));
      });

      expect(uploadResult?.success).toBe(false);
    });

    it('returns failure result when mutation throws', async () => {
      mockUploadMutate.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useImageUpload());

      let uploadResult:
        | Awaited<ReturnType<typeof result.current.upload>>
        | undefined;
      await act(async () => {
        uploadResult = await result.current.upload(makeFileList(['img.jpg']));
      });

      expect(uploadResult?.success).toBe(false);
      expect(result.current.error).toContain('Network error');
    });

    it('handles multiple files — partial success', async () => {
      mockUploadMutate
        .mockResolvedValueOnce(successResponse('https://cdn.example.com/a.jpg'))
        .mockResolvedValueOnce({
          data: {
            uploadImage: { success: false, message: 'Error', data: null },
          },
        });
      const { result } = renderHook(() => useImageUpload());

      let uploadResult:
        | Awaited<ReturnType<typeof result.current.upload>>
        | undefined;
      await act(async () => {
        uploadResult = await result.current.upload(
          makeFileList(['a.jpg', 'b.jpg'])
        );
      });

      expect(uploadResult?.success).toBe(false);
      expect(uploadResult?.error).toContain('1 de 2');
    });

    it('resets progress to zero after upload completes', async () => {
      mockUploadMutate.mockResolvedValue(successResponse());
      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.upload(makeFileList(['img.jpg']));
      });

      expect(result.current.progress).toEqual({
        current: 0,
        total: 0,
        percentage: 0,
      });
    });
  });

  it('clearError resets error state', async () => {
    mockUploadMutate.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.upload(makeFileList(['img.jpg']));
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
