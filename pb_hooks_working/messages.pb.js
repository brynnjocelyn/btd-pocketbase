/// <reference path="../pb_data/types.d.ts" />

// Bootstrap hook handler
onBootstrap((e) => {
  // Log a message when the hook is loaded
  console.log("DEBUG: messages.pb.js hook loaded and initialized");
  console.log("DEBUG: Current environment:", process.env.NODE_ENV || "not set");
  e.next();
});

// Record list request hook
// Since filtering is now handled by the collection's listRule (isActive != false),
// we don't need to manually filter inactive records here
onRecordsListRequest((e) => {
  // Just log the request and continue
  if (e.hasSuperuserAuth()) {
    console.log("DEBUG: Messages List - Superuser detected");
  }
  
  // For debugging purposes, log some basic info about the request
  console.log(
    "DEBUG: Messages List - Request received, collection:",
    e.collection?.name || "unknown",
    "- total items:",
    e.result?.items?.length || 0
  );
  
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

  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);

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
    JSON.stringify(e.record.data, null, 2),
  );

  utils.ensureRecordIsActive(e, "Message");
}, "messages");

// Message update request handler
onRecordUpdateRequest((e) => {
  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);

  const messageId = e.record.id;
  const existingMessage = e.app.findRecordById("messages", messageId);
  const requestInfo = e.requestInfo();

  // Only check permissions if attempting to change the active status
  if (utils.isChangingActiveStatus(existingMessage, requestInfo.body)) {
    const currentUserId = requestInfo.auth.id;

    if (!utils.hasUpdatePermission(existingMessage, currentUserId)) {
      e.error("You are not authorized to update this message");
      return;
    }
  }

  // Allow the update to proceed
  e.next();
}, "messages");

// Main hook handler for message creation
onRecordAfterCreateSuccess((e) => {
  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);

  const message = e.record;
  const chatId = message.get("chatId");
  const senderId = message.get("sender");
  const content = message.get("content");
  const timestamp = message.get("created");

  // Create a snippet for preview
  const snippet = utils.createSnippet(content);

  // Update the message status
  utils.prepareNewMessage(message);

  // Find the associated chat
  const chat = $app.findRecordById("chats", chatId);
  if (chat) {
    // Ensure receiver is set
    utils.ensureReceiverSet(message, chat, senderId);

    // Ensure participates key is set
    utils.ensureParticipatesKey(chat);

    // Update chat with new message details
    utils.updateChatWithMessageDetails(
      chat,
      message.id,
      snippet,
      timestamp,
      senderId,
    );

    e.next();
  }
}, "messages");

// Message deletion handler
onRecordAfterDeleteSuccess((e) => {
  // Import the utility functions
  const utils = require(`${__hooks}/messageUtils.js`);

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
  utils.updateChatPreview(chat, latestMessage);

  // Remove the deleted message from the chat's message list
  utils.removeMessageFromChat(chat, messageId);

  // Save the updated chat
  $app.save(chat);
}, "messages");
