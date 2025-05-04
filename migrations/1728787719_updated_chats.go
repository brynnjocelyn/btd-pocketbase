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

		collection, err := dao.FindCollectionByNameOrId("v7keawql0oec9kr")
		if err != nil {
			return err
		}

		// update
		edit_participantsKey := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "9bnetjqy",
			"name": "participantsKey",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_participantsKey); err != nil {
			return err
		}
		collection.Schema.AddField(edit_participantsKey)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("v7keawql0oec9kr")
		if err != nil {
			return err
		}

		// update
		edit_participantsKey := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "9bnetjqy",
			"name": "participantsKey",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_participantsKey); err != nil {
			return err
		}
		collection.Schema.AddField(edit_participantsKey)

		return dao.SaveCollection(collection)
	})
}
