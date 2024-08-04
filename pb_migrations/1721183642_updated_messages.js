/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jl4qkfzp",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "'delivered'",
        "'seen'",
        "''"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jl4qkfzp",
    "name": "field",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "'delivered'",
        "'seen'",
        "''"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
