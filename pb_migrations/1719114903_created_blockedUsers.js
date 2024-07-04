/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ch5wxfc7yqbsi1p",
    "created": "2024-06-23 03:55:03.436Z",
    "updated": "2024-06-23 03:55:03.436Z",
    "name": "blockedUsers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "s8tlc8tu",
        "name": "users",
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ch5wxfc7yqbsi1p");

  return dao.deleteCollection(collection);
})
