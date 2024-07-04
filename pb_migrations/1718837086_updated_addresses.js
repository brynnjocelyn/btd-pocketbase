/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.name = "locations"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.name = "addresses"

  return dao.saveCollection(collection)
})
