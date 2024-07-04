/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2ki0fmyo",
    "name": "chatId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "v7keawql0oec9kr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // remove
  collection.schema.removeField("2ki0fmyo")

  return dao.saveCollection(collection)
})
