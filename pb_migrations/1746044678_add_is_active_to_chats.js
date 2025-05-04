/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // add up queries...
    const collection = app.findCollectionByNameOrId("chats");

    console.log(
      "Running migration to set isActive field to true for all chats",
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
      console.log("Adding isActive field to chats collection");
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
    const chats = app.findRecordsByFilter(
      collection.id,
      "isActive = FALSE || isActive = NULL", // Only update records where isActive is false or null
      "",
      100000,
    );

    console.log(`Found ${chats.length} chats to update`);
    for (const chat of chats) {
      console.log("chat before => ", JSON.stringify(chat, null, 2));
      chat.set("isActive", true);

      console.log("chat after => ", JSON.stringify(chat, null, 2));
      app.save(chat);
    }

    console.log("Completed setting isActive field to true for all chats");

    return app.save(collection);
  },
  (app) => {
    // add down queries...
    return false;
  },
);
