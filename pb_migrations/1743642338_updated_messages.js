/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && (sender~@request.auth.id || receiver~@request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("z8mr5n2ffwfjhkv")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && (sender=@request.auth.id || receiver=@request.auth.id)"
  }, collection)

  return app.save(collection)
})
