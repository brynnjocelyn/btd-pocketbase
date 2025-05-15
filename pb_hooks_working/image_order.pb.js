/// <reference path="../pb_data/types.d.ts" />

/**
 * Validates imageOrder field to ensure it only contains existing images
 * This hook runs before any user record update to validate the imageOrder array
 */
onRecordUpdateRequest((e) => {
  // Only process requests for the users collection
  if (e.record.collection().name !== "users") {
    e.next();
    return;
  }

  // Check if the request body includes imageOrder
  const requestData = e.requestInfo().data;
  
  if (!requestData || !requestData.imageOrder) {
    // imageOrder not being updated, proceed normally
    e.next();
    return;
  }
  
  console.log("Processing imageOrder update request");
  
  try {
    // Parse the imageOrder if it's a string
    const imageOrderData = typeof requestData.imageOrder === 'string' 
      ? JSON.parse(requestData.imageOrder) 
      : requestData.imageOrder;
    
    // Validate that imageOrder is an array
    if (!Array.isArray(imageOrderData)) {
      console.log("Error: imageOrder must be an array");
      e.error(400, "imageOrder must be an array of image filenames");
      return;
    }
    
    // Get the user's current images
    const userId = e.record.id;
    const user = e.app.findRecordById("users", userId);
    const userImages = user.get("avatar") || []; // Replace "avatar" with your actual image field name
    
    // For multiple-file field, the value is an array
    const userImagesArray = Array.isArray(userImages) ? userImages : [userImages].filter(Boolean);
    
    // Check if all images in imageOrder exist in the user's images
    const invalidImages = imageOrderData.filter(img => !userImagesArray.includes(img));
    
    if (invalidImages.length > 0) {
      console.log(`Error: Invalid images in imageOrder: ${invalidImages.join(', ')}`);
      e.error(400, `imageOrder contains ${invalidImages.length} invalid image references`);
      return;
    }
    
    // Check if all user images are included in the order array
    const missingImages = userImagesArray.filter(img => !imageOrderData.includes(img));
    
    if (missingImages.length > 0) {
      console.log(`Warning: imageOrder is missing ${missingImages.length} images`);
      // You can decide whether to error out or warn but continue
      // For now, we'll just log a warning but allow the update
    }
    
    console.log("imageOrder validation successful");
  } catch (err) {
    console.log(`Error validating imageOrder: ${err.message}`);
    e.error(400, "Invalid imageOrder format");
    return;
  }
  
  // Allow the update to proceed
  e.next();
}, "users");

// Optional: Add a hook to set the default imageOrder when new images are uploaded
onRecordAfterUpdateSuccess((e) => {
  // Only process requests for the users collection
  if (e.record.collection().name !== "users") {
    e.next();
    return;
  }
  
  // Get the original record to compare
  const originalRecord = e.record.original();
  
  // Check if the original record is available (should always be for updates)
  if (!originalRecord) {
    console.log("Warning: Could not get original record state");
    e.next();
    return;
  }
  
  // Check if images were added or removed
  const currentImages = e.record.get("avatar") || []; // Replace "avatar" with your actual image field name
  const previousImages = originalRecord.get("avatar") || [];
  
  // Convert to arrays for consistent handling
  const currentImagesArray = Array.isArray(currentImages) ? currentImages : [currentImages].filter(Boolean);
  const previousImagesArray = Array.isArray(previousImages) ? previousImages : [previousImages].filter(Boolean);
  
  // Check if the images have changed
  if (JSON.stringify(currentImagesArray) !== JSON.stringify(previousImagesArray)) {
    console.log("Images changed, updating imageOrder");
    
    // Get current imageOrder
    let imageOrder = e.record.get("imageOrder") || [];
    
    // If imageOrder is not an array, initialize it
    if (!Array.isArray(imageOrder)) {
      imageOrder = [];
    }
    
    // Find new images not yet in the order
    const newImages = currentImagesArray.filter(img => !imageOrder.includes(img));
    
    // Remove images from order that no longer exist
    imageOrder = imageOrder.filter(img => currentImagesArray.includes(img));
    
    // Append new images to the end of the order
    if (newImages.length > 0) {
      imageOrder = [...imageOrder, ...newImages];
      
      // Update the record with the new order
      e.record.set("imageOrder", imageOrder);
      $app.save(e.record);
      
      console.log("imageOrder automatically updated with new images");
    }
  }
  
  e.next();
}, "users");

// Log that our hooks are loaded
onBootstrap((e) => {
  console.log("Image ordering hooks loaded");
  e.next();
});