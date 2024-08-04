/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "epsuob3c",
    "name": "isViewed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9uwv33vj",
    "name": "isDelivered",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mvg5cmgi",
    "name": "replyToMessageId",
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
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // remove
  collection.schema.removeField("epsuob3c")

  // remove
  collection.schema.removeField("9uwv33vj")

  // remove
  collection.schema.removeField("mvg5cmgi")

  return dao.saveCollection(collection)
})
