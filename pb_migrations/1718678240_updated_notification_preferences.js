/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r94xk2n7",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "email",
        "push",
        "sms"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r94xk2n7",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "email",
        "push"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
