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

  // The record will be saved automatically after the hook completes
  e.next();
}, "users");

// Log that our hook is loaded
onBootstrap((e) => {
  console.log("Simplified user defaults hook loaded");
  e.next();
});