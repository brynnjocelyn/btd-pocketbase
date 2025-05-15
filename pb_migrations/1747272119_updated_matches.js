/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("1o3gs69j6eurdub");

  // Remove existing fields we're going to replace
  collection.schema.removeField("1m9ih11k"); // userId
  collection.schema.removeField("533hbqxu"); // matchedUsers

  // Add new fields
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lz10bjqm",
    "name": "userId1",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 1,
      "displayFields": []
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wqfxr39n",
    "name": "userId2",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 1,
      "displayFields": []
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3tckslmv",
    "name": "matchRequestId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "match_requests",
      "cascadeDelete": false,
      "minSelect": 0,
      "maxSelect": 1,
      "displayFields": []
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f7lkqwjt",
    "name": "matchedDate",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": "",
      "format": "datetime"
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ztlxp5ov",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": ["ACTIVE", "BLOCKED"]
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ztyxp18a",
    "name": "lastInteraction",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": "",
      "format": "datetime"
    }
  }));

  // Create indexes for performance
  collection.indexes = [
    "CREATE INDEX `idx_matches_user1` ON `matches` (`userId1`)",
    "CREATE INDEX `idx_matches_user2` ON `matches` (`userId2`)",
    "CREATE INDEX `idx_matches_status` ON `matches` (`status`)",
    "CREATE INDEX `idx_matches_user1_status` ON `matches` (`userId1`, `status`)",
    "CREATE INDEX `idx_matches_user2_status` ON `matches` (`userId2`, `status`)",
    "CREATE INDEX `idx_matches_matchedDate` ON `matches` (`matchedDate`)",
    "CREATE INDEX `idx_matches_matchRequestId` ON `matches` (`matchRequestId`)"
  ];

  // Set access rules
  collection.listRule = "@request.auth.id != \"\" && (userId1 = @request.auth.id || userId2 = @request.auth.id)";
  collection.viewRule = "@request.auth.id != \"\" && (userId1 = @request.auth.id || userId2 = @request.auth.id)";
  collection.createRule = "@request.auth.id != \"\" && (userId1 = @request.auth.id || userId2 = @request.auth.id)";
  collection.updateRule = "@request.auth.id != \"\" && (userId1 = @request.auth.id || userId2 = @request.auth.id)";
  collection.deleteRule = "@request.auth.id != \"\"";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("1o3gs69j6eurdub");

  // Restore original fields
  collection.schema.removeField("lz10bjqm"); // userId1
  collection.schema.removeField("wqfxr39n"); // userId2
  collection.schema.removeField("3tckslmv"); // matchRequestId
  collection.schema.removeField("f7lkqwjt"); // matchedDate
  collection.schema.removeField("ztlxp5ov"); // status
  collection.schema.removeField("ztyxp18a"); // lastInteraction
  
  // Add back original fields
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1m9ih11k",
    "name": "userId",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));
  
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "533hbqxu",
    "name": "matchedUsers",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }));

  // Reset indexes
  collection.indexes = [];

  // Reset rules
  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
  collection.deleteRule = null;

  return app.save(collection);
});