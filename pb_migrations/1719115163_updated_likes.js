/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hv3qqki4zi47sbb")

  collection.name = "likedUsers"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hv3qqki4zi47sbb")

  collection.name = "likes"

  return dao.saveCollection(collection)
})
