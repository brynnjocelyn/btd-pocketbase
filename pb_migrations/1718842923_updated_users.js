/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7v6hr0to",
    "name": "location",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "jxuuuycyb4npuvt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jwv5kmgf",
    "name": "notificationPreferences",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "xdac6m6kckt314w",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jkgdktnc",
    "name": "pronouns",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "\"SHE/HER/HERS\"",
        "\"HE/HIM/HIS\"",
        "\"THEY/THEM/THEIRS\"",
        "\"ASK MY PRONOUNS\"",
        "\"PREFER NOT TO DISCLOSE\""
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("7v6hr0to")

  // remove
  collection.schema.removeField("jwv5kmgf")

  // remove
  collection.schema.removeField("jkgdktnc")

  return dao.saveCollection(collection)
})
