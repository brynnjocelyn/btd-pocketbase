/// <reference path="../pb_data/types.d.ts" />

/**
 * Creates a participants key for a chat from user IDs
 * @param {Array} users - Array of user IDs
 * @returns {string} Sorted and joined user IDs
 */
function createParticipantsKey(users) {
  return users.sort().join("_");
}

/**
 * Finds an existing chat with the given participants key
 * @param {Object} app - The app object for database access
 * @param {string} participantsKey - The key to search for
 * @returns {Object|null} The existing chat or null if none found
 */
function findExistingChat(app, participantsKey) {
  const existingChats = app.findRecordsByFilter(
    "chats",
    `participantsKey = '${participantsKey}'`,
    null,
    1,
    0
  );
  
  return existingChats.length > 0 ? existingChats[0] : null;
}

// Hook to prevent duplicate chat creation 
onRecordCreateRequest((e) => {
  const record = e.record;
  const app = e.app;
  
  // Get or create the participants key
  let participantsKey = record.get("participantsKey");
  if (!participantsKey) {
    const users = record.get("users");
    participantsKey = createParticipantsKey(users);
  }
  
  // Find existing chat with same participants
  const existingChat = findExistingChat(app, participantsKey);
  
  if (existingChat) {
    // Return the existing chat instead of creating a new one
    return e.response(200, { chat: existingChat });
  }
  
  // No existing chat found, continue with creation
  e.next();
}, "chats");

// Filter inactive chats from list results for non-superusers
onRecordsListRequest((e) => {
  if (e.hasSuperuserAuth()) {
    console.log("DEBUG: Chats - Superuser detected, returning all chats");
    e.next();
    return;
  }
  
  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);
  
  console.log("DEBUG: Chats - Before filtering - Total chats:", e.result?.items?.length || 0);
  if (e.result?.items?.length > 0) {
    console.log("DEBUG: Chats - First chat isActive value:", e.result.items[0].get("isActive"));
    console.log("DEBUG: Chats - First chat fields:", JSON.stringify(e.result.items[0].data, null, 2));
  }
  
  // Use the same filtering logic as messages
  utils.filterActiveRecords(e.result);
  
  console.log("DEBUG: Chats - After filtering - Total chats:", e.result?.items?.length || 0);
  if (e.result?.items?.length > 0) {
    console.log("DEBUG: Chats - Sample chat after filtering:", JSON.stringify(e.result.items[0].data, null, 2));
    console.log("DEBUG: Chats - Request filter:", JSON.stringify(e.requestInfo().query, null, 2));
  } else {
    console.log("DEBUG: Chats - No chats passed filtering");
  }
  
  e.next();
}, "chats");

// Prevent viewing inactive chats for non-superusers
onRecordViewRequest((e) => {
  if (e.hasSuperuserAuth()) {
    console.log("DEBUG: Chats View - Superuser detected, allowing view of chat:", e.record.id);
    e.next();
    return;
  }
  
  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);
  
  console.log("DEBUG: Chats View - Checking if chat is active:", e.record.id);
  console.log("DEBUG: Chats View - isActive value:", e.record.get("isActive"), "type:", typeof e.record.get("isActive"));
  console.log("DEBUG: Chats View - Chat fields:", JSON.stringify(e.record.data, null, 2));
  
  // Use ensureRecordIsActive from utils
  utils.ensureRecordIsActive(e, "Chat");
}, "chats");

/**
 * Checks if a chat is being deactivated
 * @param {Object} chat - The chat record
 * @returns {boolean} True if chat is being deactivated
 */
function isChatBeingDeactivated(chat) {
  // Handle cases where isActive might be undefined
  const currentIsActive = chat.get("isActive");
  console.log(`DEBUG: isChatBeingDeactivated - Current isActive: ${currentIsActive}, type: ${typeof currentIsActive}`);
  
  // Get the original record - handle case where it might not exist
  const originalRecord = chat.original();
  if (!originalRecord) {
    console.log(`DEBUG: isChatBeingDeactivated - No original record found, not a deactivation`);
    return false;
  }
  
  const originalIsActive = originalRecord.get("isActive");
  console.log(`DEBUG: isChatBeingDeactivated - Original isActive: ${originalIsActive}, type: ${typeof originalIsActive}`);
  
  // Only consider truly deactivated when going from explicitly true to explicitly false
  const isDeactivated = currentIsActive === false && originalIsActive === true;
  console.log(`DEBUG: isChatBeingDeactivated - Is being deactivated: ${isDeactivated}`);
  console.log(`DEBUG: isChatBeingDeactivated - Condition: currentIsActive === false (${currentIsActive === false}) && originalIsActive === true (${originalIsActive === true})`);
  
  return isDeactivated;
}

/**
 * Deactivates all active messages in a chat
 * @param {Object} txApp - Transaction app instance 
 * @param {string} chatId - ID of the chat
 */
function deactivateMessages(txApp, chatId) {
  if (!chatId) {
    console.log("WARNING: Cannot deactivate messages - no chat ID provided");
    return;
  }
  
  console.log(`DEBUG: deactivateMessages - Starting deactivation for chat: ${chatId}`);
  
  try {
    // Find all active messages for this chat (either active or where isActive is not set)
    // First try with messages that have isActive=true
    const filter1 = `chatId = '${chatId}' && isActive = true`;
    console.log(`DEBUG: deactivateMessages - Looking for messages with filter: ${filter1}`);
    
    let messages = txApp.findRecordsByFilter(
      "messages",
      filter1,
      null,
      0, // No limit (fetch all)
      0
    );
    
    console.log(`DEBUG: deactivateMessages - Found ${messages.length} messages with isActive = true`);
    
    // Add messages that don't have isActive set at all
    const filter2 = `chatId = '${chatId}' && isActive = ''`;
    console.log(`DEBUG: deactivateMessages - Looking for messages with filter: ${filter2}`);
    
    const messagesWithNoIsActive = txApp.findRecordsByFilter(
      "messages",
      filter2,  // Simpler way to find records without the field set
      null,
      0,
      0
    );
    
    console.log(`DEBUG: deactivateMessages - Found ${messagesWithNoIsActive.length} messages with no isActive value`);
    
    // Combine the results
    if (messagesWithNoIsActive && messagesWithNoIsActive.length > 0) {
      messages = messages.concat(messagesWithNoIsActive);
      console.log(`DEBUG: deactivateMessages - Combined total messages to deactivate: ${messages.length}`);
    }
    
    if (!messages || messages.length === 0) {
      console.log(`DEBUG: deactivateMessages - No messages found to deactivate for chat: ${chatId}`);
      return; // No messages to update
    }
    
    // Deactivate each message
    let updatedCount = 0;
    messages.forEach((message, index) => {
      try {
        console.log(`DEBUG: deactivateMessages - Deactivating message ${index+1}/${messages.length}: ${message.id}`);
        console.log(`DEBUG: deactivateMessages - Previous isActive value: ${message.get("isActive")}`);
        
        message.set("isActive", false);
        txApp.save(message);
        updatedCount++;
        
        console.log(`DEBUG: deactivateMessages - Successfully deactivated message: ${message.id}`);
      } catch (err) {
        console.log(`DEBUG: deactivateMessages - Error deactivating message ${message.id}: ${err.message}`);
        // Continue with other messages even if one fails
      }
    });
    
    console.log(`DEBUG: deactivateMessages - Successfully deactivated ${updatedCount}/${messages.length} messages`);
  } catch (err) {
    console.log(`DEBUG: deactivateMessages - Error in deactivation process: ${err.message}`);
    // Catch any errors but continue execution
    // This prevents a failed message deactivation from breaking the whole transaction
  }
}

// Hook to handle chat deactivation and cascading updates
onRecordUpdateRequest((e) => {
  console.log(`DEBUG: Chat Update - Processing update for chat: ${e.record.id}`);
  
  const chat = e.record;
  const isBeingDeactivated = isChatBeingDeactivated(chat);
  
  console.log(`DEBUG: Chat Update - Current isActive: ${chat.get("isActive")}, type: ${typeof chat.get("isActive")}`);
  console.log(`DEBUG: Chat Update - Is being deactivated: ${isBeingDeactivated}`);
  
  $app.runInTransaction((txApp) => {
    // Check if the chat is being deactivated
    if (isBeingDeactivated) {
      console.log(`DEBUG: Chat Update - Deactivating all messages for chat: ${chat.id}`);
      // Deactivate all messages in this chat
      deactivateMessages(txApp, chat.id);
    }
  });
  
  // Allow the update to proceed
  console.log(`DEBUG: Chat Update - Completing update for chat: ${e.record.id}`);
  e.next();
}, "chats");