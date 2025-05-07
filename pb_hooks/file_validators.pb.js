/// <reference path="../pb_data/types.d.ts" />

/**
 * Utility functions for file validation
 */

/**
 * Maximum allowed file size in bytes
 * Default: 5MB
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Validates an uploaded image file
 * @param {Object} file - The file object from the request
 * @returns {Object} Result with status and message
 */
function validateImageFile(file) {
  if (!file) {
    return { valid: false, message: "No file provided" };
  }

  console.log(`DEBUG: validateImageFile - Inspecting file object structure:`);
  console.log(`DEBUG: File keys: ${Object.keys(file).join(", ")}`);

  // Extract size from the correct location
  const fileSize = file.size || file.reader?.header?.size || 0;
  console.log(
    `DEBUG: File size extracted: ${fileSize} bytes (${(fileSize / 1024).toFixed(2)}KB)`,
  );

  // Check file size
  if (fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Extract filename for mime type inference
  const fileName =
    file.originalName || file.name || file.reader?.header?.filename || "";
  console.log(`DEBUG: File name extracted: ${fileName}`);

  // Since file.type might not be available, infer from extension
  const fileExt = fileName.split(".").pop().toLowerCase();
  console.log(`DEBUG: File extension extracted: ${fileExt}`);

  // Map extensions to mime types
  const extToMime = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  // Get mime type from file or infer from extension
  const mimeType = file.type || extToMime[fileExt] || "";
  console.log(`DEBUG: MIME type determined: ${mimeType}`);

  // Check file type
  if (!mimeType || !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validates file and returns appropriate error response if invalid
 * @param {Object} e - The event object
 * @param {string} fieldName - Name of the file field
 * @returns {boolean} True if validation passes, false otherwise
 */
function validateAndHandleImageUpload(e, fieldName = "image") {
  try {
    console.log(
      `DEBUG: Validating ${fieldName} upload - ID:${e.record?.id || "new"} Collection:${e.record?.collection().name || "unknown"}`,
    );

    // Get files from the request
    const files = e.findUploadedFiles(fieldName);

    console.log(
      `DEBUG: findUploadedFiles returned: ${typeof files} ${files ? (Array.isArray(files) ? `array of length ${files.length}` : "not an array") : "null"}`,
    );

    // If no files or empty array, skip validation
    if (!files || (Array.isArray(files) && files.length === 0)) {
      console.log(
        `DEBUG: No ${fieldName} files found in request - Skipping validation`,
      );
      return true;
    }

    // Log the entire file structure for debugging
    try {
      console.log(`DEBUG: Files structure: ${JSON.stringify(files, null, 2)}`);
    } catch (jsonErr) {
      console.log(`DEBUG: Cannot stringify files object: ${jsonErr.message}`);
      console.log(
        `DEBUG: Files type: ${typeof files}, isArray: ${Array.isArray(files)}`,
      );
      if (Array.isArray(files)) {
        console.log(`DEBUG: Files length: ${files.length}`);
        if (files.length > 0) {
          console.log(
            `DEBUG: First file keys: ${Object.keys(files[0]).join(", ")}`,
          );
        }
      }
    }

    // Get the first file for validation
    const fileToValidate = Array.isArray(files) ? files[0] : files;

    if (!fileToValidate) {
      console.log(
        `DEBUG: No valid file found to validate - Skipping validation`,
      );
      return true;
    }

    console.log(
      `DEBUG: Processing file for validation: ${fileToValidate.name || fileToValidate.originalName || "unknown"}`,
    );

    // Validate the file
    const result = validateImageFile(fileToValidate);
    console.log(
      `DEBUG: Validation result: ${result.valid ? "Valid" : "Invalid"} - ${result.message || ""}`,
    );

    if (!result.valid) {
      console.log(`DEBUG: Rejecting file with error: ${result.message}`);
      e.error(400, result.message);
      return false;
    }

    console.log(`DEBUG: File validation successful for ${fieldName}`);
    return true;
  } catch (err) {
    console.error(`ERROR: File validation exception: ${err.message}`);
    console.error(`ERROR: Stack trace: ${err.stack || "Not available"}`);
    e.error(500, "Error processing file upload");
    return false;
  }
}

// Export functions using CommonJS module pattern
// This is the official documented way to share code between hooks
module.exports = {
  validateImageFile: validateImageFile,
  validateAndHandleImageUpload: validateAndHandleImageUpload,
  MAX_FILE_SIZE: MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES: ALLOWED_IMAGE_TYPES,
};
