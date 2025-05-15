/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "date2764121011",
    "max": "",
    "min": "",
    "name": "lastActive",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
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

  // update field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "phknrluy",
    "name": "isOnline",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("date2764121011")

  // remove field
  collection.fields.removeById("select3688522124")

  // update field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "phknrluy",
    "name": "online",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
