/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(24, new Field({
    "hidden": false,
    "id": "select3688522124",
    "maxSelect": 1,
    "name": "statusVisibility",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "everyone",
      "contacts",
      "none"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(24, new Field({
    "hidden": false,
    "id": "select3688522124",
    "maxSelect": 1,
    "name": "statusVisibility",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "EVERYONE",
      "CONTACTS_ONLY",
      "ALWAYS_OFFLINE"
    ]
  }))

  return app.save(collection)
})
