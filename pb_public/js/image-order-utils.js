/**
 * Utility functions for managing image ordering
 */

/**
 * Updates the order of images for a user
 * 
 * @param {PocketBase} pb - The PocketBase client instance
 * @param {string} userId - ID of the user to update
 * @param {string[]} imageOrder - Array of image filenames in the desired order
 * @returns {Promise} - A promise that resolves when the update is complete
 */
async function updateImageOrder(pb, userId, imageOrder) {
  if (!Array.isArray(imageOrder)) {
    throw new Error('imageOrder must be an array of image filenames');
  }
  
  try {
    const result = await pb.collection('users').update(userId, {
      imageOrder: imageOrder
    });
    
    return result;
  } catch (error) {
    console.error('Failed to update image order:', error);
    throw error;
  }
}

/**
 * Gets the ordered images for a user
 * If no explicit order is set, returns the images in their original order
 * 
 * @param {PocketBase} pb - The PocketBase client instance
 * @param {string} userId - ID of the user
 * @param {string} imageFieldName - Name of the field containing images (default: 'avatar')
 * @returns {Promise<string[]>} - A promise that resolves to an array of image filenames in order
 */
async function getOrderedImages(pb, userId, imageFieldName = 'avatar') {
  try {
    const user = await pb.collection('users').getOne(userId, {
      fields: `id,${imageFieldName},imageOrder`
    });
    
    // Get the images and image order
    const images = user[imageFieldName] || [];
    const imageOrder = user.imageOrder || [];
    
    // If no explicit order or empty order, return original images
    if (!imageOrder || imageOrder.length === 0) {
      return images;
    }
    
    // Create a map for O(1) lookup to check if images exist
    const imageMap = new Set(images);
    
    // Filter the order to only include existing images
    const validOrderedImages = imageOrder.filter(img => imageMap.has(img));
    
    // Find images that are not in the order and add them at the end
    const unorderedImages = images.filter(img => !imageOrder.includes(img));
    
    // Combine ordered and unordered images
    return [...validOrderedImages, ...unorderedImages];
  } catch (error) {
    console.error('Failed to get ordered images:', error);
    throw error;
  }
}

// Export the functions if using in a module environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateImageOrder,
    getOrderedImages
  };
}