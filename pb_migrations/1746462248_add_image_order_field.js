/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  
  console.log("Running migration to add imageOrder field to users collection");
  
  // Check if the imageOrder field already exists
  if (collection.fields.find(field => field.getName() === "imageOrder")) {
    console.log("imageOrder field already exists, skipping");
    return;
  }
  
  // Add a JSON field to store image order
  collection.fields.add(
    new Field({
      id: "imageorder_field",
      name: "imageOrder",
      type: "json",
      required: false,
      system: false,
      options: {}
    }),
  );
  
  console.log("imageOrder field added successfully");
  
  return app.save(collection);
}, (app) => {
  // Revert migration
  const collection = app.findCollectionByNameOrId("users");
  
  console.log("Reverting: removing imageOrder field from users collection");
  
  // Remove the field
  collection.fields.removeByName("imageOrder");
  
  return app.save(collection);
});