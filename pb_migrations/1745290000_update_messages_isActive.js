/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("messages");

    console.log(
      "Running migration to set isActive field to true for all messages",
    );

    // First, check if there's an "IsActive" field (camel case issue) and rename it to "isActive"
    const isActiveField = collection.fields.find((field) => {
      return field.getName() === "IsActive";
    });

    if (isActiveField) {
      console.log("Found 'IsActive' field - renaming to 'isActive'");
      isActiveField.name = "isActive";
      app.save(collection);
    }

    // Then check if the isActive field exists, if not, add it
    if (
      !collection.fields.find((field) => {
        console.log("start =============");
        console.log(field.getName(), JSON.stringify(field));
        console.log("end =============");
        return field.getName() === "isActive";
      })
    ) {
      console.log("Adding isActive field to messages collection");
      collection.fields.add(
        new Field({
          autogeneratePattern: "",
          hidden: true,
          id: "isactive_field",
          name: "isActive",
          required: false,
          system: false,
          type: "bool",
          default: true,
          options: {},
        }),
      );

      app.save(collection);
    }

    // Now update all existing records
    const messages = app.findRecordsByFilter(
      collection.id,
      "isActive = FALSE || isActive = NULL", // Only update records where isActive is false or null
      "",
      100000,
    );

    console.log(`Found ${messages.length} messages to update`);
    // console.log(
    //   "messages",
    //   messages.map((message) => JSON.stringify(message, null, 2)),
    // );
    for (const message of messages) {
      console.log("message before => ", JSON.stringify(message, null, 2));
      message.set("isActive", true);
      const status = message.get("status");
      if (!status) {
        message.set("status", "delivered");
      }
      console.log("message after => ", JSON.stringify(message, null, 2));
      app.save(message);
    }

    console.log("Completed setting isActive field to true for all messages");

    return app.save(collection);
  },
  (db) => {
    // This migration is not reversible as we don't know the original values
    return false;
  },
);
