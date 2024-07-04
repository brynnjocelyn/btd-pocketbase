/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vr8v3avs",
    "name": "ethnicity",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 3,
      "values": [
        "Asian",
        "Black or African American",
        "Hispanic or Latino",
        "Native American or Alaska Native",
        "Native Hawaiian or Other Pacific Islander",
        "White",
        "Middle Eastern or North African",
        "Multiracial or Biracial",
        "Other"
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
    "id": "vr8v3avs",
    "name": "ethnicity",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "Asian",
        "Black or African American",
        "Hispanic or Latino",
        "Native American or Alaska Native",
        "Native Hawaiian or Other Pacific Islander",
        "White",
        "Middle Eastern or North African",
        "Multiracial or Biracial",
        "Other"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
