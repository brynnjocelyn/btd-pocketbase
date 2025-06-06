/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.listRule = "@request.auth.id != '' && @request.auth.id = userId"
  collection.updateRule = "@request.auth.id != '' && @request.auth.id = userId"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.listRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
