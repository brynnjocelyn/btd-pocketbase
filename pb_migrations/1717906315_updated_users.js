/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wc3zotrc",
    "name": "matches",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "76i2dcdb",
    "name": "genderIdentity",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "CIS_MAN",
        "CIS_WOMAN",
        "TRANS_MAN",
        "TRANS_WOMAN",
        "TWO_SPIRIT",
        "NON_BINARY",
        "GENDER_QUEER",
        "GENDER_FLUID",
        "GENDER_NEUTRAL",
        "ANDROGYNE",
        "POLY_PAN_GENDER"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "90oywbqb",
    "name": "genderSpectrum",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10,
      "noDecimal": true
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "54l3sbkf",
    "name": "headline",
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
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("wc3zotrc")

  // remove
  collection.schema.removeField("76i2dcdb")

  // remove
  collection.schema.removeField("90oywbqb")

  // remove
  collection.schema.removeField("54l3sbkf")

  return dao.saveCollection(collection)
})
