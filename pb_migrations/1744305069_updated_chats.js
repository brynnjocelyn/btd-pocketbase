/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": true,
    "id": "bool1260321794",
    "name": "active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // remove field
  collection.fields.removeById("bool1260321794")

  return app.save(collection)
})
