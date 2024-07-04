/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.createRule = null
  collection.updateRule = "@request.auth.id != '' && @request.auth.id = userId"
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
