/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.viewRule = "@request.auth.id != '' && @request.auth.id = userId"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jxuuuycyb4npuvt")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
