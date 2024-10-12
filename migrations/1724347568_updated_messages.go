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

		collection, err := dao.FindCollectionByNameOrId("z8mr5n2ffwfjhkv")
		if err != nil {
			return err
		}

		// add
		new_reciever := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "fsxdkqvg",
			"name": "reciever",
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
		}`), new_reciever); err != nil {
			return err
		}
		collection.Schema.AddField(new_reciever)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("z8mr5n2ffwfjhkv")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("fsxdkqvg")

		return dao.SaveCollection(collection)
	})
}
