package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("1o3gs69j6eurdub")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("1m9ih11k")

		// add
		new_userId2 := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "6rve47gu",
			"name": "userId2",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_userId2); err != nil {
			return err
		}
		collection.Schema.AddField(new_userId2)

		// update
		edit_userId1 := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "533hbqxu",
			"name": "userId1",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), edit_userId1); err != nil {
			return err
		}
		collection.Schema.AddField(edit_userId1)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("1o3gs69j6eurdub")
		if err != nil {
			return err
		}

		// add
		del_userId := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "1m9ih11k",
			"name": "userId",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_userId); err != nil {
			return err
		}
		collection.Schema.AddField(del_userId)

		// remove
		collection.Schema.RemoveField("6rve47gu")

		// update
		edit_userId1 := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "533hbqxu",
			"name": "matchedUsers",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": null
			}
		}`), edit_userId1); err != nil {
			return err
		}
		collection.Schema.AddField(edit_userId1)

		return dao.SaveCollection(collection)
	})
}
