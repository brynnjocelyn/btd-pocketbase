/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("messages");
  
  console.log("Running migration to add indexes to messages collection");
  
  // Add indexes for efficient message querying
  const existingIndexes = collection.indexes || [];
  
  // Don't add duplicate indexes
  const indexNames = existingIndexes.map(idx => {
    // Extract index name from SQL statement if possible
    const match = idx.match(/CREATE\s+INDEX\s+(\w+)/i);
    return match ? match[1] : idx;
  });
  
  const newIndexes = [];
  
  // Index for querying messages by chat
  if (!indexNames.includes("idx_messages_chatId")) {
    newIndexes.push("CREATE INDEX idx_messages_chatId ON messages (chatId)");
  }
  
  // Index for querying messages by type
  if (!indexNames.includes("idx_messages_type")) {
    newIndexes.push("CREATE INDEX idx_messages_type ON messages (messageType)");
  }
  
  // Combined index for chat + created date for efficient message history
  if (!indexNames.includes("idx_messages_chat_created")) {
    newIndexes.push("CREATE INDEX idx_messages_chat_created ON messages (chatId, created)");
  }
  
  // Add the new indexes
  collection.indexes = [...existingIndexes, ...newIndexes];
  
  if (newIndexes.length > 0) {
    console.log(`Added ${newIndexes.length} new indexes to messages collection`);
  } else {
    console.log("No new indexes needed");
  }
  
  return app.save(collection);
}, (app) => {
  // Revert migration - remove the added indexes
  const collection = app.findCollectionByNameOrId("messages");
  
  console.log("Reverting: removing indexes from messages collection");
  
  // Filter out the indexes we added
  const indexesToKeep = (collection.indexes || []).filter(idx => {
    return !idx.includes("idx_messages_chatId") && 
           !idx.includes("idx_messages_type") && 
           !idx.includes("idx_messages_chat_created");
  });
  
  collection.indexes = indexesToKeep;
  
  return app.save(collection);
});