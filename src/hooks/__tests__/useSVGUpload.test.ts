import { renderHook, act } from '@testing-library/react';
import { useSVGUpload } from '../useSVGUpload';

const mockUploadSvgMutate = vi.fn();

vi.mock('@/generated/graphql', () => ({
  useUploadSvgMutation: () => [mockUploadSvgMutate, { loading: false }],
}));

const VALID_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/><circle cx="50" cy="50" r="30" fill="blue"/></svg>';

const makeSVGFile = (content = VALID_SVG, name = 'icon.svg', sizeOverride?: number): File => {
  const file = new File([content], name, { type: 'image/svg+xml' });
  if (sizeOverride !== undefined) {
    Object.defineProperty(file, 'size', { value: sizeOverride });
  }
  return file;
};

const successMutationResponse = {
  data: {
    uploadSvg: {
      success: true,
      message: 'SVG subido',
      data: {
        url: 'https://cdn.example.com/icon.svg',
        filename: 'icon.svg',
        imageId: 'svg-1',
        optimized: true,
        sanitized: true,
        originalSize: 100,
        optimizedSize: 80,
      },
    },
  },
};

describe('useSVGUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadSvgMutate.mockResolvedValue(successMutationResponse);
  });

  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useSVGUpload());
    expect(result.current.loading).toBe(false);
    expect(result.current.progress).toBeNull();
    expect(result.current.error).toBeNull();
  });

  describe('validateSVG', () => {
    it('accepts a valid SVG file', () => {
      const { result } = renderHook(() => useSVGUpload());
      const validation = result.current.validateSVG(makeSVGFile());
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('rejects non-SVG extension', () => {
      const { result } = renderHook(() => useSVGUpload());
      const file = new File(['x'.repeat(200)], 'image.png', { type: 'image/png' });
      const validation = result.current.validateSVG(file);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('rejects files larger than 500KB', () => {
      const { result } = renderHook(() => useSVGUpload());
      const file = makeSVGFile(VALID_SVG, 'large.svg', 600_000);
      const validation = result.current.validateSVG(file);
      expect(validation.isValid).toBe(false);
    });
  });

  describe('uploadSVG', () => {
    it('returns upload result on valid SVG', async () => {
      const { result } = renderHook(() => useSVGUpload());

      let uploadResult: Awaited<ReturnType<typeof result.current.uploadSVG>> | undefined;
      await act(async () => {
        uploadResult = await result.current.uploadSVG(makeSVGFile());
      });

      expect(uploadResult?.url).toBe('https://cdn.example.com/icon.svg');
      expect(uploadResult?.optimized).toBe(true);
    });

    it('calls mutation with correct variables', async () => {
      const { result } = renderHook(() => useSVGUpload());
      await act(async () => { await result.current.uploadSVG(makeSVGFile()); });

      expect(mockUploadSvgMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            entityType: 'category',
            optimize: true,
            sanitize: true,
          }),
        })
      );
    });

    it('throws and sets error for file with non-SVG extension', async () => {
      const { result } = renderHook(() => useSVGUpload());
      const file = new File(['x'.repeat(200)], 'image.png', { type: 'image/png' });

      await act(async () => {
        await expect(result.current.uploadSVG(file)).rejects.toBeDefined();
      });

      expect(result.current.error).not.toBeNull();
      expect(mockUploadSvgMutate).not.toHaveBeenCalled();
    });

    it('throws and sets error when SVG content lacks <svg> tag', async () => {
      const { result } = renderHook(() => useSVGUpload());
      const content = 'x'.repeat(200);
      const file = new File([content], 'bad.svg', { type: 'image/svg+xml' });

      await act(async () => {
        await expect(result.current.uploadSVG(file)).rejects.toBeDefined();
      });

      expect(result.current.error).not.toBeNull();
    });

    it('throws and sets error when server responds success=false', async () => {
      mockUploadSvgMutate.mockResolvedValueOnce({
        data: { uploadSvg: { success: false, message: 'Error servidor', data: null } },
      });
      const { result } = renderHook(() => useSVGUpload());

      await act(async () => {
        await expect(result.current.uploadSVG(makeSVGFile())).rejects.toBeDefined();
      });

      expect(result.current.error).not.toBeNull();
    });

    it('throws and sets error when mutation throws', async () => {
      mockUploadSvgMutate.mockRejectedValueOnce(new Error('Network timeout'));
      const { result } = renderHook(() => useSVGUpload());

      await act(async () => {
        await expect(result.current.uploadSVG(makeSVGFile())).rejects.toBeDefined();
      });

      expect(result.current.error).not.toBeNull();
    });
  });

  it('clearError resets error state', async () => {
    mockUploadSvgMutate.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSVGUpload());

    await act(async () => {
      await expect(result.current.uploadSVG(makeSVGFile())).rejects.toBeDefined();
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  it('reset clears all state', async () => {
    mockUploadSvgMutate.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSVGUpload());

    await act(async () => {
      await expect(result.current.uploadSVG(makeSVGFile())).rejects.toBeDefined();
    });
    act(() => result.current.reset());

    expect(result.current.loading).toBe(false);
    expect(result.current.progress).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
