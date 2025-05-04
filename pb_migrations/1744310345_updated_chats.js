/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.id != '' && users ~ @request.auth.id "
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("v7keawql0oec9kr")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.id != '' && users ?= @request.auth.id "
  }, collection)

  return app.save(collection)
})
