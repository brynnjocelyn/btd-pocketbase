/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("messages");
  
  console.log("Running migration to add image field to messages collection");
  
  // Check if the image field already exists
  if (collection.fields.find(field => field.getName() === "image")) {
    console.log("Image field already exists, skipping");
    return;
  }
  
  // Add a file field to store images
  collection.fields.add(
    new Field({
      id: "message_image",
      name: "image",
      type: "file",
      required: false,
      system: false,
      options: {
        maxSelect: 1,
        maxSize: 5242880, // 5MB max file size
        mimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp"
        ],
        thumbs: ["100x100"], // Generate a thumbnail
        protected: false,
      }
    })
  );
  
  // Add a field to store the message type
  if (!collection.fields.find(field => field.getName() === "messageType")) {
    collection.fields.add(
      new Field({
        id: "message_type",
        name: "messageType",
        type: "text",
        required: true,
        system: false,
        default: "text"
      })
    );
  }
  
  // Add a field for thumbnail URL (for easier client access)
  if (!collection.fields.find(field => field.getName() === "thumbnailUrl")) {
    collection.fields.add(
      new Field({
        id: "thumbnail_url",
        name: "thumbnailUrl",
        type: "text",
        required: false,
        system: false,
      })
    );
  }
  
  console.log("Fields added successfully to messages collection");
  
  return app.save(collection);
}, (app) => {
  // Revert migration - remove the added fields
  const collection = app.findCollectionByNameOrId("messages");
  
  console.log("Reverting: removing image-related fields from messages collection");
  
  // Remove the fields
  collection.fields.removeByName("image");
  collection.fields.removeByName("messageType");
  collection.fields.removeByName("thumbnailUrl");
  
  return app.save(collection);
});