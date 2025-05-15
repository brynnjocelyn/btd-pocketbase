/**
 * Utility functions for message processing
 */

/**
 * Adds an 'isActive != false' filter to the request query parameters
 * This ensures PocketBase filters inactive records at the database level
 * before pagination is applied
 * 
 * @param {Object} e - The request event object
 * @returns {boolean} True if filter was added, false if superuser (no filter needed)
 */
function addActiveFilterToQuery(e) {
  // Skip filtering for superusers
  if (e.hasSuperuserAuth()) {
    console.log("DEBUG: addActiveFilterToQuery - Superuser detected, not adding filter");
    return false;
  }
  
  // Access the request query
  const requestInfo = e.requestInfo();
  const query = requestInfo.query || {};
  
  console.log("DEBUG: addActiveFilterToQuery - Original filter:", query.filter || "none");
  
  // Add isActive != false filter to existing filter if present
  if (query.filter && query.filter.trim() !== "") {
    query.filter = `(${query.filter}) && isActive != false`;
  } else {
    query.filter = "isActive != false";
  }
  
  console.log("DEBUG: addActiveFilterToQuery - Updated filter:", query.filter);
  
  // Update the request query
  requestInfo.query = query;
  
  return true;
}

/**
 * Filters out inactive records from a result set and fixes pagination
 * A record is considered active if:
 * - isActive is explicitly set to true, OR
 * - isActive is undefined/null (not set in the record)
 * 
 * @param {Object} result - The result object containing items array and pagination info
 * @returns {Object} The filtered result with corrected pagination
 */
function filterActiveRecords(result) {
  // Handle null/undefined result gracefully
  if (!result || !result.items) {
    console.log("DEBUG: filterActiveRecords - result or items is null/undefined");
    return result;
  }
  
  // Original state
  const originalItemCount = result.items.length;
  const originalTotalItems = result.totalItems || 0;
  const originalTotalPages = result.totalPages || 0;
  const perPage = result.perPage || 0;
  
  console.log(`DEBUG: filterActiveRecords - Original state:
    Items: ${originalItemCount}
    Total items: ${originalTotalItems}
    Total pages: ${originalTotalPages}
    Per page: ${perPage}`);
  
  // Build a new array with only the active records
  const filteredItems = [];
  let excludedCount = 0;
  
  for (let i = 0; i < result.items.length; i++) {
    const record = result.items[i];
    const isActive = record.get("isActive");
    
    // Skip records that are explicitly set to false
    // Keep all other records (true, undefined, null, etc.)
    if (isActive !== false) {
      filteredItems.push(record);
    } else {
      excludedCount++;
      console.log(`DEBUG: Excluding record ${record.id} because isActive is explicitly false`);
    }
  }
  
  // Estimate the total number of inactive records in the full dataset
  // based on the ratio of inactive items in the current page
  let inactiveRatio = 0;
  if (originalItemCount > 0) {
    inactiveRatio = excludedCount / originalItemCount;
  }
  
  // Estimate the total actual count by applying the same ratio
  // This is an approximation that works reasonably well for consistent data distributions
  const estimatedTotalActive = Math.round(originalTotalItems * (1 - inactiveRatio));
  
  // Update the result with filtered items and corrected counts
  result.items = filteredItems;
  
  // Update totalItems - use estimated total for more accurate pagination
  result.totalItems = estimatedTotalActive;
  
  // Recalculate totalPages based on the new totalItems and perPage
  if (perPage > 0) {
    result.totalPages = Math.ceil(estimatedTotalActive / perPage);
  }
  
  console.log(`DEBUG: filterActiveRecords - New state:
    Items kept: ${filteredItems.length}/${originalItemCount}
    Excluded: ${excludedCount}
    Inactive ratio: ${(inactiveRatio * 100).toFixed(1)}%
    Estimated total active: ${estimatedTotalActive}
    New total pages: ${result.totalPages}`);
    
  return result;
}

/**
 * Checks if a record is active, returns 404 if not
 * @param {Object} e - The event object
 * @param {string} entityType - Type of entity for error message
 */
function ensureRecordIsActive(e, entityType) {
  // Only return 404 if isActive is explicitly set to false
  // If isActive doesn't exist or is null/undefined, treat as active
  const isActive = e.record.get("isActive");
  
  console.log(`DEBUG: ensureRecordIsActive - Record ID: ${e.record.id}, isActive: ${isActive}`);
  console.log(`DEBUG: ensureRecordIsActive - isActive type: ${typeof isActive}`);
  console.log(`DEBUG: ensureRecordIsActive - isActive === false: ${isActive === false}`);
  
  if (isActive === false) {
    console.log(`DEBUG: ensureRecordIsActive - Blocking access to ${entityType} ${e.record.id} (isActive is false)`);
    e.error(404, `${entityType} has previously been deleted`);
  } else {
    console.log(`DEBUG: ensureRecordIsActive - Allowing access to ${entityType} ${e.record.id}`);
    e.next();
  }
}

/**
 * Verifies that a user has permission to update a message
 * @param {Object} message - The message record being modified
 * @param {string} userId - ID of the user making the request
 * @returns {boolean} True if the user has permission, false otherwise
 */
function hasUpdatePermission(message, userId) {
  return message.get("sender") === userId;
}

/**
 * Determines if a message update is attempting to change the isActive status
 * @param {Object} existingMessage - The original message record
 * @param {Object} requestBody - The incoming request body 
 * @returns {boolean} True if the update changes isActive status
 */
function isChangingActiveStatus(existingMessage, requestBody) {
  const isActive = requestBody["isActive"];
  return isActive !== undefined && isActive !== existingMessage.get("isActive");
}

/**
 * Creates a snippet from content, trimming to 50 chars and adding ellipsis if needed
 * @param {string} content - The full content
 * @return {string} Trimmed content with ellipsis if needed
 */
function createSnippet(content) {
  return content.length > 50 ? content.substring(0, 47) + "..." : content;
}

/**
 * Updates a message record with delivery status and active flag
 * @param {Object} message - The message record to update
 */
function prepareNewMessage(message) {
  message.set("status", "delivered");
  message.set("isActive", true);
  $app.save(message);
}

/**
 * Ensures the message has a receiver set
 * @param {Object} message - The message record
 * @param {Object} chat - The chat record
 * @param {string} senderId - ID of the message sender
 */
function ensureReceiverSet(message, chat, senderId) {
  if (!message.get("receiver")) {
    const users = chat.get("users");
    const receiverId = users.find(userId => userId !== senderId);
    message.set("receiver", receiverId);
    $app.save(message);
  }
}

/**
 * Ensures the chat has a participants key
 * @param {Object} chat - The chat record
 */
function ensureParticipatesKey(chat) {
  if (!chat.get("participatesKey")) {
    const users = chat.get("users");
    const key = users.sort().join("_");
    chat.set("participatesKey", key);
  }
}

/**
 * Updates chat with latest message details
 * @param {Object} chat - The chat record
 * @param {string} messageId - ID of the new message
 * @param {string} snippet - Message content snippet
 * @param {string} timestamp - Message timestamp
 * @param {string} senderId - ID of the message sender
 */
function updateChatWithMessageDetails(chat, messageId, snippet, timestamp, senderId) {
  // Add message to the chat's message list
  const messages = chat.get("messages") || [];
  messages.push(messageId);
  chat.set("messages", messages);
  
  // Update chat preview data
  chat.set("lastMessageSnippet", snippet);
  chat.set("lastMessageTimestamp", timestamp);
  chat.set("lastMessageSender", senderId);
  
  $app.save(chat);
}

/**
 * Updates chat preview with the latest message data or clears it if no messages remain
 * @param {Object} chat - The chat record to update
 * @param {Object|null} latestMessage - The latest message in the chat, or null if none
 */
function updateChatPreview(chat, latestMessage) {
  if (latestMessage) {
    // Update with the latest message data
    const snippet = createSnippet(latestMessage.get("content"));
    const timestamp = latestMessage.get("created");
    const senderId = latestMessage.get("sender");
    
    chat.set("lastMessageSnippet", snippet);
    chat.set("lastMessageTimestamp", timestamp);
    chat.set("lastMessageSender", senderId);
  } else {
    // No messages left, clear the preview fields
    chat.set("lastMessageSnippet", "");
    chat.set("lastMessageTimestamp", "");
    chat.set("lastMessageSender", "");
  }
}

/**
 * Removes a message ID from a chat's message list
 * @param {Object} chat - The chat record to update
 * @param {string} messageId - The ID of the message to remove
 */
function removeMessageFromChat(chat, messageId) {
  const messages = chat.get("messages") || [];
  const updatedMessages = messages.filter(id => id !== messageId);
  chat.set("messages", updatedMessages);
}

// Export all utility functions using CommonJS module pattern
module.exports = {
  filterActiveRecords,
  addActiveFilterToQuery,
  ensureRecordIsActive,
  hasUpdatePermission,
  isChangingActiveStatus,
  createSnippet,
  prepareNewMessage,
  ensureReceiverSet,
  ensureParticipatesKey,
  updateChatWithMessageDetails,
  updateChatPreview,
  removeMessageFromChat
};