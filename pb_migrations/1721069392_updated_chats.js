/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v7keawql0oec9kr")

  collection.listRule = "@request.auth.id != '' && users ~ @request.auth.id "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v7keawql0oec9kr")

  collection.listRule = "@request.auth.id != '' && users ?= @request.auth.id "

  return dao.saveCollection(collection)
})
