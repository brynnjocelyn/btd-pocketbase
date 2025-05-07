/// <reference path="../pb_data/types.d.ts" />

/**
 * Server-side hooks for handling image messages
 */

/**
 * Validates and sets message type before creation
 */
onRecordCreateRequest((e) => {
  // Only process for messages collection
  if (e.record.collection().name !== "messages") {
    e.next();
    return;
  }

  console.log(`DEBUG: Message Create Request - ID: ${e.record.id || 'new'} - Starting processing`);
  
  try {
    // Log request details
    const requestInfo = e.requestInfo();
    console.log(`DEBUG: Message create request details:
      Method: ${requestInfo.method}
      Auth: ${requestInfo.auth ? 'Authenticated' : 'Not authenticated'}
      User ID: ${requestInfo.auth?.id || 'none'}
      Body fields: ${Object.keys(requestInfo.body || {}).join(', ') || 'none'}
      Query params: ${Object.keys(requestInfo.query || {}).join(', ') || 'none'}
    `);
    
    // Check related data
    const chatId = e.record.get("chatId");
    const sender = e.record.get("sender");
    console.log(`DEBUG: Message data - ChatID: ${chatId}, Sender: ${sender}, Current content: "${e.record.get("content") || ''}"`);
    
    // Import the validators module
    console.log(`DEBUG: Importing file validators module`);
    const validators = require(`${__hooks}/file_validators.pb.js`);

    // Validate image file if present
    console.log(`DEBUG: Starting file validation`);
    if (!validators.validateAndHandleImageUpload(e, "image")) {
      console.log(`DEBUG: Image validation failed, request terminated`);
      return; // Validation failed, response already sent
    }

    // Check if the request includes an image
    console.log(`DEBUG: Checking for image files in request`);
    const imageFiles = e.findUploadedFiles("image");
    const hasImage = imageFiles != null && imageFiles.length > 0;
    console.log(`DEBUG: Image files found: ${hasImage}, Count: ${imageFiles?.length || 0}`);

    // Set message type based on content
    if (hasImage) {
      console.log(`DEBUG: Processing image message - Setting messageType to "image"`);
      e.record.set("messageType", "image");

      // If no content was provided but there's an image, add a placeholder
      if (!e.record.get("content")) {
        console.log(`DEBUG: No caption provided, adding default placeholder`);
        e.record.set("content", "[Image]");
      } else {
        console.log(`DEBUG: Caption provided: "${e.record.get("content")}"`);
      }
      
      // Log file details
      const imageFile = imageFiles[0];
      console.log(`DEBUG: Proceeding with image: ${imageFile.name}, Size: ${(imageFile.size/1024).toFixed(2)}KB, Type: ${imageFile.type}`);
    } else {
      // Default to text message
      console.log(`DEBUG: No image detected, setting messageType to "text"`);
      e.record.set("messageType", "text");
    }
    
    console.log(`DEBUG: Message create request processing completed successfully`);
  } catch (err) {
    console.error(`ERROR: Message creation exception: ${err.message}`);
    console.error(`ERROR: Stack trace: ${err.stack || 'Not available'}`);
    e.error(500, "Error processing message");
    return;
  }

  e.next();
});

/**
 * Processes image message after creation
 * Generates thumbnail URL and updates chat preview
 */
onRecordAfterCreateSuccess((e) => {
  // Only process for messages collection
  if (e.record.collection().name !== "messages") {
    e.next();
    return;
  }

  console.log(`DEBUG: Message After Create Success - ID: ${e.record.id} - Starting post-processing`);

  const messageType = e.record.get("messageType") || "text";
  const chatId = e.record.get("chatId");
  
  console.log(`DEBUG: Processing created message - Type: ${messageType}, ChatID: ${chatId}`);
  console.log(`DEBUG: Message fields: ${JSON.stringify(e.record.data || {})}`);

  try {
    if (messageType === "image") {
      console.log(`DEBUG: Processing image type message - Generating thumbnail`);
      
      // Get image info for preview generation
      const image = e.record.get("image");
      console.log(`DEBUG: Image field value: ${image || 'Not set'}`);

      // If there's an image, add thumbnail URL for easier access
      if (image) {
        // Since requestInfo() is not available in after-create events,
        // we need to construct the path without the baseUrl
        // The path will be relative to the server's root
        console.log(`DEBUG: Generating thumbnail URL (relative path)`);
        
        const thumbUrl = `/api/files/messages/${e.record.id}/${image}?thumb=100x100`;
        console.log(`DEBUG: Generated thumbnail URL: ${thumbUrl}`);

        // Update record with thumbnail URL
        console.log(`DEBUG: Setting thumbnailUrl field on message ${e.record.id}`);
        e.record.set("thumbnailUrl", thumbUrl);
        
        console.log(`DEBUG: Saving message with thumbnail URL`);
        const saveResult = $app.save(e.record);
        console.log(`DEBUG: Save result: ${saveResult ? 'Success' : 'Failed'}`);

        console.log(`DEBUG: Created image message with thumbnail: ${thumbUrl}`);
      } else {
        console.log(`DEBUG: Warning - Image message without image field value`);
      }
    } else {
      console.log(`DEBUG: Non-image message type (${messageType}), skipping thumbnail generation`);
    }

    // Update chat with appropriate preview for this message
    if (chatId) {
      console.log(`DEBUG: Updating chat ${chatId} with message preview`);
      
      try {
        console.log(`DEBUG: Looking up chat record by ID: ${chatId}`);
        const chat = $app.findRecordById("chats", chatId);
        
        if (!chat) {
          console.error(`ERROR: Chat ${chatId} not found`);
          return;
        }
        
        console.log(`DEBUG: Found chat: ${chat.id} - Current messages: ${(chat.get("messages") || []).length}`);
        console.log(`DEBUG: Current chat preview: "${chat.get("lastMessageSnippet") || ''}"`);
        
        const sender = e.record.get("sender") || "";
        const timestamp = e.record.get("created") || new Date().toISOString();
        console.log(`DEBUG: Message sender: ${sender}, timestamp: ${timestamp}`);

        // Create a snippet based on message type
        let snippet = "";
        if (messageType === "image") {
          console.log(`DEBUG: Creating image message snippet`);
          // Use emoji to indicate image
          snippet = "📷 Image";

          // If there's a caption, add it
          const content = e.record.get("content");
          console.log(`DEBUG: Image caption: "${content || ''}"`);
          
          if (content && content !== "[Image]") {
            const shortContent = content.substring(0, 30);
            const needsEllipsis = content.length > 30;
            snippet += `: ${shortContent}${needsEllipsis ? "..." : ""}`;
            console.log(`DEBUG: Adding caption to snippet: "${snippet}"`);
          }
        } else {
          console.log(`DEBUG: Creating text message snippet`);
          // For text messages, use the content
          const content = e.record.get("content") || "";
          const shortContent = content.substring(0, 50);
          const needsEllipsis = content.length > 50;
          snippet = shortContent + (needsEllipsis ? "..." : "");
          console.log(`DEBUG: Generated text snippet: "${snippet}"`);
        }

        // Update chat preview
        console.log(`DEBUG: Setting chat preview fields - Snippet: "${snippet}"`);
        chat.set("lastMessageSnippet", snippet);
        chat.set("lastMessageTimestamp", timestamp);
        chat.set("lastMessageSender", sender);

        // Add message to chat's messages array if it exists
        console.log(`DEBUG: Adding message ${e.record.id} to chat's message list`);
        const messages = chat.get("messages") || [];
        const originalCount = messages.length;
        messages.push(e.record.id);
        chat.set("messages", messages);
        console.log(`DEBUG: Updated message list: ${originalCount} → ${messages.length} messages`);

        // Ensure the chat is active
        console.log(`DEBUG: Ensuring chat is marked as active`);
        chat.set("isActive", true);

        console.log(`DEBUG: Saving updated chat ${chatId}`);
        const saveResult = $app.save(chat);
        console.log(`DEBUG: Chat save result: ${saveResult ? 'Success' : 'Failed'}`);
        console.log(`DEBUG: Updated chat ${chatId} with new message preview: "${snippet}"`);
      } catch (err) {
        console.error(`ERROR: Error updating chat for message: ${err.message}`);
        console.error(`ERROR: Stack trace: ${err.stack || 'Not available'}`);
      }
    } else {
      console.log(`DEBUG: No chatId provided, skipping chat preview update`);
    }
  } catch (err) {
    console.error(`Error in image message processing: ${err.message}`);
  }

  e.next();
});

/**
 * Hook for message update requests
 * Ensures image messages maintain proper type and metadata
 */
onRecordUpdateRequest((e) => {
  // Only process for messages collection
  if (e.record.collection().name !== "messages") {
    e.next();
    return;
  }

  try {
    // Import the validators module
    const validators = require(`${__hooks}/file_validators.pb.js`);

    // Validate image file if present
    if (!validators.validateAndHandleImageUpload(e, "image")) {
      return; // Validation failed, response already sent
    }

    // Check if the request includes a new image
    const hasNewImage = e.findUploadedFiles("image") != null;

    // If updating with a new image, ensure messageType is set to "image"
    if (hasNewImage) {
      e.record.set("messageType", "image");

      // Cleanup old thumbnailUrl if changing image
      // New one will be set in AfterUpdateSuccess
      e.record.set("thumbnailUrl", "");
    }
  } catch (err) {
    console.error(`Error in message update validation: ${err.message}`);
    e.error(500, "Error processing message update");
    return;
  }

  e.next();
});

/**
 * Process image updates and regenerate thumbnails if needed
 */
onRecordAfterUpdateSuccess((e) => {
  // Only process for messages collection
  if (e.record.collection().name !== "messages") {
    e.next();
    return;
  }

  try {
    const messageType = e.record.get("messageType");

    // Only process image messages
    if (messageType === "image") {
      const image = e.record.get("image");
      const thumbnailUrl = e.record.get("thumbnailUrl");

      // If there's an image but no thumbnailUrl, generate one
      if (image && (!thumbnailUrl || thumbnailUrl === "")) {
        // Generate relative URL since requestInfo() is not available in after-update events
        const newThumbUrl = `/api/files/messages/${e.record.id}/${image}?thumb=100x100`;
        console.log(`DEBUG: Generated new thumbnail URL: ${newThumbUrl}`);

        e.record.set("thumbnailUrl", newThumbUrl);
        $app.save(e.record);

        console.log(`Updated image message with new thumbnail: ${newThumbUrl}`);
      }
    }
  } catch (err) {
    console.error(`Error in image message update processing: ${err.message}`);
  }

  e.next();
});

// Log that our hooks are loaded
onBootstrap((e) => {
  console.log("Image message hooks loaded successfully");
  e.next();
});

