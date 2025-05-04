/**
 * Filters out inactive records from a result set
 * @param {Object} result - The result object containing items array
 * @returns {Array} Filtered array of active items only
 */
/**
 * Filters out inactive records from a result set
 * A record is considered active if:
 * - isActive is explicitly set to true, OR
 * - isActive is undefined/null (not set in the record)
 *
 * @param {Object} result - The result object containing items array
 * @returns {Object} The filtered result
 */
function filterActiveRecords(result) {
  // Handle null/undefined result gracefully
  if (!result || !result.items) {
    console.log(
      "DEBUG: filterActiveRecords - result or items is null/undefined",
    );
    return result;
  }

  console.log(
    "DEBUG: filterActiveRecords - Processing",
    result.items.length,
    "items",
  );

  // Build a new array with only the active records
  const filteredItems = [];

  for (let i = 0; i < result.items.length; i++) {
    const record = result.items[i];
    const isActive = record.get("isActive");

    console.log(
      `DEBUG: Record ${i} - id: ${record.id}, isActive:`,
      isActive,
      `(type: ${typeof isActive}, excluded: ${isActive === false})`,
    );

    // Skip records that are explicitly set to false
    // Keep all other records (true, undefined, null, etc.)
    if (isActive !== false) {
      filteredItems.push(record);
    } else {
      console.log(
        `DEBUG: Excluding record ${record.id} because isActive is explicitly false`,
      );
    }
  }

  // Update the result with filtered items
  result.items = filteredItems;
  result.totalItems = filteredItems.length;
  console.log(
    "DEBUG: filterActiveRecords - Kept",
    filteredItems.length,
    "items after filtering",
  );
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

  console.log(
    `DEBUG: ensureRecordIsActive - Record ID: ${e.record.id}, isActive: ${isActive}`,
  );
  console.log(
    `DEBUG: ensureRecordIsActive - isActive type: ${typeof isActive}`,
  );
  console.log(
    `DEBUG: ensureRecordIsActive - isActive === false: ${isActive === false}`,
  );

  if (isActive === false) {
    console.log(
      `DEBUG: ensureRecordIsActive - Blocking access to ${entityType} ${e.record.id} (isActive is false)`,
    );
    e.error(404, `${entityType} has previously been deleted`);
  } else {
    console.log(
      `DEBUG: ensureRecordIsActive - Allowing access to ${entityType} ${e.record.id}`,
    );
    e.next();
  }
}

// Filter inactive messages from list results for non-superusers
onRecordsListRequest((e) => {
  if (e.hasSuperuserAuth()) {
    console.log("DEBUG: Superuser detected, returning all messages");
    e.next();
    return;
  }

  console.log(
    "DEBUG: Before filtering - Total messages:",
    e.result?.items?.length || 0,
  );
  if (e.result?.items?.length > 0) {
    console.log(
      "DEBUG: First message isActive value:",
      e.result.items[0].get("isActive"),
    );
    console.log(
      "DEBUG: First message fields:",
      JSON.stringify(e.result.items[0], null, 2),
    );
  }

  // filterActiveRecords(e.result);

  console.log(
    "DEBUG: After filtering - Total messages:",
    e.result?.items?.length || 0,
  );
  if (e.result?.items?.length > 0) {
    console.log(
      "DEBUG: Sample message after filtering:",
      JSON.stringify(e.result.items[0], null, 2),
    );
    console.log(
      "DEBUG: Request filter:",
      JSON.stringify(e.requestInfo().query, null, 2),
    );
  } else {
    console.log("DEBUG: No messages passed filtering");
  }

  e.next();
}, "messages");

// Prevent viewing inactive messages for non-superusers
onRecordViewRequest((e) => {
  if (e.hasSuperuserAuth()) {
    console.log(
      "DEBUG: View request - Superuser detected, allowing view of message:",
      e.record.id,
    );
    e.next();
    return;
  }

  console.log(
    "DEBUG: View request - Checking if message is active:",
    e.record.id,
  );
  console.log(
    "DEBUG: View request - isActive value:",
    e.record.get("isActive"),
    "type:",
    typeof e.record.get("isActive"),
  );
  console.log(
    "DEBUG: View request - Message fields:",
    JSON.stringify(e.record, null, 2),
  );

  ensureRecordIsActive(e, "Message");
}, "messages");

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

// Message update request handler
onRecordUpdateRequest((e) => {
  const messageId = e.record.id;
  const existingMessage = e.app.findRecordById("messages", messageId);
  const requestInfo = e.requestInfo();

  // Only check permissions if attempting to change the active status
  if (isChangingActiveStatus(existingMessage, requestInfo.body)) {
    const currentUserId = requestInfo.auth.id;

    if (!hasUpdatePermission(existingMessage, currentUserId)) {
      e.error("You are not authorized to update this message");
      return;
    }
  }

  // Allow the update to proceed
  e.next();
}, "messages");

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
    const receiverId = users.find((userId) => userId !== senderId);
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
function updateChatWithMessageDetails(
  chat,
  messageId,
  snippet,
  timestamp,
  senderId,
) {
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

// Main hook handler for message creation
onRecordAfterCreateSuccess((e) => {
  const message = e.record;
  const chatId = message.get("chatId");
  const senderId = message.get("sender");
  const content = message.get("content");
  const timestamp = message.get("created");

  // Create a snippet for preview
  const snippet = createSnippet(content);

  // Update the message status
  prepareNewMessage(message);

  // Find the associated chat
  const chat = $app.findRecordById("chats", chatId);
  if (chat) {
    // Ensure receiver is set
    ensureReceiverSet(message, chat, senderId);

    // Ensure participates key is set
    ensureParticipatesKey(chat);

    // Update chat with new message details
    updateChatWithMessageDetails(
      chat,
      message.id,
      snippet,
      timestamp,
      senderId,
    );

    e.next();
  }
}, "messages");

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
  const updatedMessages = messages.filter((id) => id !== messageId);
  chat.set("messages", updatedMessages);
}

// Message deletion handler
onRecordAfterDeleteSuccess((e) => {
  const message = e.record;
  const chatId = message.get("chatId");
  const messageId = message.id;

  // Find the chat record
  const chat = $app.findRecordById("chats", chatId);
  if (!chat) return;

  // Find the latest remaining message in the chat
  const latestMessage = $app.findFirstRecordByFilter(
    "messages",
    `chatId = '${chatId}'`,
    "-created", // Sort by created date descending (latest first)
  );

  // Update the chat preview with latest message data
  updateChatPreview(chat, latestMessage);

  // Remove the deleted message from the chat's message list
  removeMessageFromChat(chat, messageId);

  // Save the updated chat
  $app.save(chat);
}, "messages");

onBootstrap((e) => {
  // Log a message when the hook is loaded
  console.log("DEBUG: messages.pb.js hook loaded and initialized");
  console.log("DEBUG: Current environment:", process.env.NODE_ENV || "not set");
  e.next();
});
