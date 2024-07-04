/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // update
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
        "POLY_PAN_GENDER",
        "ANDROGYNOUS"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // update
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

  return dao.saveCollection(collection)
})
