/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != '' && sender = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  return app.save(collection)
})
