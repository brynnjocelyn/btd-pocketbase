/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Correct the field name from "reciever" to "receiver"
    const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv");
    
    // Find the field with the typo
    const fieldWithTypo = collection.fields.find(f => f.name === "reciever");
    
    if (fieldWithTypo) {
      console.log("Found field with typo 'reciever', fixing to 'receiver'");
      fieldWithTypo.name = "receiver";
      return app.save(collection);
    } else {
      console.log("No 'reciever' field found. Migration not needed.");
      return false;
    }
  },
  (app) => {
    // Revert change: rename back from "receiver" to "reciever"
    const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv");
    
    // Find the corrected field
    const correctedField = collection.fields.find(f => f.name === "receiver");
    
    if (correctedField) {
      console.log("Reverting: renaming 'receiver' back to 'reciever'");
      correctedField.name = "reciever";
      return app.save(collection);
    } else {
      console.log("No 'receiver' field found. Revert not needed.");
      return false;
    }
  }
);