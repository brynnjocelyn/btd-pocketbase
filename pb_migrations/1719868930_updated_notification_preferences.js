/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  collection.viewRule = "@request.auth.id !=\"\" && @request.auth.id = userId "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xdac6m6kckt314w")

  collection.viewRule = ""

  return dao.saveCollection(collection)
})
