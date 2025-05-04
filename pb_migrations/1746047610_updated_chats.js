/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "isactive_field",
    "name": "isActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": true,
    "id": "isactive_field",
    "name": "isActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
