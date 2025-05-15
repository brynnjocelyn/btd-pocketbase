/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "match_requests",
    "name": "match_requests",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ibf4kxot",
        "name": "requesterId",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "jn4htpam",
        "name": "targetId",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "yvd28atb",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": ["PENDING", "ACCEPTED", "DECLINED", "CANCELLED"]
        }
      },
      {
        "system": false,
        "id": "9kznvp7y",
        "name": "message",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "nkd5gj8p",
        "name": "notificationSent",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "fjklhpod",
        "name": "notificationRead",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_match_requests_requester` ON `match_requests` (`requesterId`)",
      "CREATE INDEX `idx_match_requests_target` ON `match_requests` (`targetId`)",
      "CREATE INDEX `idx_match_requests_status` ON `match_requests` (`status`)",
      "CREATE INDEX `idx_match_requests_requester_status` ON `match_requests` (`requesterId`, `status`)",
      "CREATE INDEX `idx_match_requests_target_status` ON `match_requests` (`targetId`, `status`)"
    ],
    "listRule": "@request.auth.id != \"\" && (requesterId = @request.auth.id || targetId = @request.auth.id)",
    "viewRule": "@request.auth.id != \"\" && (requesterId = @request.auth.id || targetId = @request.auth.id)",
    "createRule": "@request.auth.id != \"\" && requesterId = @request.auth.id",
    "updateRule": "@request.auth.id != \"\" && (requesterId = @request.auth.id || targetId = @request.auth.id)",
    "deleteRule": "@request.auth.id != \"\" && requesterId = @request.auth.id",
    "options": {}
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("match_requests");
  
  return app.delete(collection);
});