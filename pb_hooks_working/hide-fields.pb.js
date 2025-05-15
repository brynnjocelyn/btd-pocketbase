/// <reference path="../pb_data/types.d.ts" />
onRecordEnrich(
  (e) => {
    if (e.requestInfo.hasSuperuserAuth()) {
      e.next();
      return;
    }
    // hide collection fields
    e.record.hide("collectionId", "collectionName");

    e.next();
  },
  ["chats", "messages", "users"],
);
