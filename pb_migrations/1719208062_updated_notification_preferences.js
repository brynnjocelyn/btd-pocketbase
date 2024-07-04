/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  collection.viewRule = "id = @request.auth.id && @request.auth.is != \"\""
  collection.createRule = "id = @request.auth.id && @request.auth.is != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
