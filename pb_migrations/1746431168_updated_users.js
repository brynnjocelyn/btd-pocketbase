/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "jkgdktnc",
    "maxSelect": 1,
    "name": "pronouns",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "SHE/HER/HERS",
      "HE/HIM/HIS",
      "THEY/THEM/THEIRS",
      "ASK MY PRONOUNS",
      "PREFER NOT TO DISCLOSE"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "jkgdktnc",
    "maxSelect": 1,
    "name": "pronouns",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "\"SHE/HER/HERS\"",
      "\"HE/HIM/HIS\"",
      "\"THEY/THEM/THEIRS\"",
      "\"ASK MY PRONOUNS\"",
      "\"PREFER NOT TO DISCLOSE\""
    ]
  }))

  return app.save(collection)
})
