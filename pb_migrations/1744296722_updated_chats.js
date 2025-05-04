/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2576258212",
    "max": 0,
    "min": 0,
    "name": "lastMessageSnippet",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date2157853005",
    "max": "",
    "min": "",
    "name": "lastMessageTimestamp",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3454078854",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "lastMessageSender",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // remove field
  collection.fields.removeById("text2576258212")

  // remove field
  collection.fields.removeById("date2157853005")

  // remove field
  collection.fields.removeById("relation3454078854")

  return app.save(collection)
})
