/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ch5wxfc7yqbsi1p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kdkmygpx",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ch5wxfc7yqbsi1p")

  // remove
  collection.schema.removeField("kdkmygpx")

  return dao.saveCollection(collection)
})
