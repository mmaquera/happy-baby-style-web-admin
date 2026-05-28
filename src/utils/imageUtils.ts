/**
 * Utility functions for handling image URLs and paths
 * Centralizes the logic for converting absolute URLs to relative paths
 * following the same pattern used in categories
 */

/**
 * Converts an absolute URL to a relative path
 * @param url - The URL to convert (can be absolute or already relative)
 * @returns The relative path or null if the URL is invalid
 */
export const convertToRelativePath = (
  url: string | null | undefined
): string | null => {
  if (!url) return null;

  // If it's already a relative path, return as is
  if (!url.startsWith('http')) {
    return url;
  }

  try {
    // Convert absolute URL to relative path
    return new URL(url).pathname;
  } catch (error) {
    console.warn('Invalid URL provided to convertToRelativePath:', url);
    return null;
  }
};

/**
 * Converts an array of image URLs to relative paths
 * @param urls - Array of image URLs to convert
 * @returns Array of relative paths (nulls are filtered out)
 */
export const convertImageUrlsToRelativePaths = (urls: string[]): string[] => {
  return urls
    .map(convertToRelativePath)
    .filter((path): path is string => Boolean(path));
};

/**
 * Checks if an image URL is a valid backend URL (not a blob URL)
 * @param url - The URL to check
 * @returns True if the URL is valid for backend storage
 */
export const isValidBackendImageUrl = (url: string): boolean => {
  return url.startsWith('http') && !url.startsWith('blob:');
};

/**
 * Validates that all images in an array are valid backend URLs
 * @param urls - Array of image URLs to validate
 * @returns True if all URLs are valid backend URLs
 */
export const validateBackendImageUrls = (urls: string[]): boolean => {
  return urls.length === 0 || urls.every(isValidBackendImageUrl);
};
