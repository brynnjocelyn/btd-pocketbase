/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  collection.listRule = "@request.auth.id != '' "
  collection.viewRule = "@request.auth.id != '' "
  collection.createRule = "@request.auth.id != '' "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
