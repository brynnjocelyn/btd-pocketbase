/// <reference path="../pb_data/types.d.ts" />

/**
 * Sets default values for user fields when a new user is created
 */
onRecordCreateRequest((e) => {
  // Only process for users collection
  if (e.record.collection().name !== "users") {
    e.next();
    return;
  }

  console.log(`Setting default values for new user: ${e.record.id || 'new'}`);

  // Set isOnline default to false if not already set
  if (e.record.get("isOnline") === undefined || e.record.get("isOnline") === null) {
    console.log("Setting default isOnline = false");
    e.record.set("isOnline", false);
  }

  // Set statusVisibility default to "everyone" if not already set
  if (e.record.get("statusVisibility") === undefined || e.record.get("statusVisibility") === null) {
    console.log("Setting default statusVisibility = everyone");
    e.record.set("statusVisibility", "everyone");
  }

  // Continue with the request
  e.next();
}, "users");

// Simple bootstrap hook that just logs
onBootstrap((e) => {
  console.log("User defaults hook loaded");
  e.next();
});