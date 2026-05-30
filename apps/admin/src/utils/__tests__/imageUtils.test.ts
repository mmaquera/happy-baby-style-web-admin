import {
  convertToRelativePath,
  convertImageUrlsToRelativePaths,
  isValidBackendImageUrl,
  validateBackendImageUrls,
} from '../imageUtils';

describe('convertToRelativePath', () => {
  it('returns null for null input', () => {
    expect(convertToRelativePath(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(convertToRelativePath(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(convertToRelativePath('')).toBeNull();
  });

  it('returns relative path unchanged', () => {
    expect(convertToRelativePath('/images/product.jpg')).toBe(
      '/images/product.jpg'
    );
  });

  it('returns relative path without leading slash unchanged', () => {
    expect(convertToRelativePath('images/product.jpg')).toBe(
      'images/product.jpg'
    );
  });

  it('extracts pathname from absolute URL', () => {
    expect(
      convertToRelativePath('https://cdn.example.com/images/product.jpg')
    ).toBe('/images/product.jpg');
  });

  it('extracts pathname from http URL', () => {
    expect(convertToRelativePath('http://localhost:3000/uploads/img.png')).toBe(
      '/uploads/img.png'
    );
  });

  it('returns null for malformed URL', () => {
    expect(convertToRelativePath('http://[invalid')).toBeNull();
  });
});

describe('convertImageUrlsToRelativePaths', () => {
  it('converts array of absolute URLs to relative paths', () => {
    const urls = [
      'https://cdn.example.com/img1.jpg',
      'https://cdn.example.com/img2.jpg',
    ];
    expect(convertImageUrlsToRelativePaths(urls)).toEqual([
      '/img1.jpg',
      '/img2.jpg',
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(convertImageUrlsToRelativePaths([])).toEqual([]);
  });

  it('filters out nulls from invalid URLs', () => {
    const urls = ['https://cdn.example.com/ok.jpg', 'http://[invalid'];
    const result = convertImageUrlsToRelativePaths(urls);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('/ok.jpg');
  });

  it('preserves relative paths as-is', () => {
    const urls = ['/images/a.jpg', '/images/b.jpg'];
    expect(convertImageUrlsToRelativePaths(urls)).toEqual(urls);
  });
});

describe('isValidBackendImageUrl', () => {
  it('returns true for https URL', () => {
    expect(isValidBackendImageUrl('https://cdn.example.com/img.jpg')).toBe(
      true
    );
  });

  it('returns true for http URL', () => {
    expect(isValidBackendImageUrl('http://localhost:3000/img.jpg')).toBe(true);
  });

  it('returns false for blob URL', () => {
    expect(isValidBackendImageUrl('blob:http://localhost/abc-123')).toBe(false);
  });

  it('returns false for relative path', () => {
    expect(isValidBackendImageUrl('/images/product.jpg')).toBe(false);
  });

  it('returns false for data URL', () => {
    expect(isValidBackendImageUrl('data:image/png;base64,abc')).toBe(false);
  });
});

describe('validateBackendImageUrls', () => {
  it('returns true for empty array', () => {
    expect(validateBackendImageUrls([])).toBe(true);
  });

  it('returns true when all URLs are valid backend URLs', () => {
    const urls = [
      'https://cdn.example.com/a.jpg',
      'https://cdn.example.com/b.jpg',
    ];
    expect(validateBackendImageUrls(urls)).toBe(true);
  });

  it('returns false when any URL is a blob', () => {
    const urls = ['https://cdn.example.com/a.jpg', 'blob:http://localhost/abc'];
    expect(validateBackendImageUrls(urls)).toBe(false);
  });

  it('returns false when any URL is relative', () => {
    const urls = ['https://cdn.example.com/a.jpg', '/local/img.jpg'];
    expect(validateBackendImageUrls(urls)).toBe(false);
  });
});
