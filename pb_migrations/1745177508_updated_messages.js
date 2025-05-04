/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "bool1929417870",
    "name": "IsActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // remove field
  collection.fields.removeById("bool1929417870")

  return app.save(collection)
})
