/**
 * Utility functions for image loading and management
 */

/**
 * Preload an array of images to ensure they're cached for immediate display
 * @param imageUrls Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  const loadPromises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });
  
  return Promise.all(loadPromises);
};

/**
 * Load a single image and get a callback when it's ready
 * @param imageUrl URL of the image to load
 * @returns Promise that resolves when the image is loaded
 */
export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

/**
 * Check if images are already cached in the browser
 * @param imageUrls Array of image URLs to check
 * @returns Array of booleans indicating whether each image is cached
 */
export const checkImagesCached = (imageUrls: string[]): boolean[] => {
  return imageUrls.map(url => {
    // Create a temporary image to check if it's in cache
    const img = new Image();
    img.src = url;
    // If complete is true and naturalHeight is not 0, the image is cached
    return img.complete && img.naturalHeight !== 0;
  });
};
