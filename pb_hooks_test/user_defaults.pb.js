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

// Create a migration to ensure existing users have these defaults
onBootstrap((e) => {
  console.log("User defaults hook loaded");
  
  // Run this migration once at startup to set defaults for any existing users
  try {
    // Find users without these defaults set
    const usersNeedingDefaults = $app.findRecordsByFilter(
      "users",
      "isOnline = '' || isOnline = null || statusVisibility = '' || statusVisibility = null",
      null, // sorting is not needed
      0,    // no limit
      0     // no offset
    );
    
    if (usersNeedingDefaults && usersNeedingDefaults.length > 0) {
      console.log(`Found ${usersNeedingDefaults.length} users without default values. Setting defaults...`);
      
      let updatedCount = 0;
      
      for (let i = 0; i < usersNeedingDefaults.length; i++) {
        const user = usersNeedingDefaults[i];
        let changed = false;
        
        // Set isOnline default
        if (user.get("isOnline") === undefined || user.get("isOnline") === null || user.get("isOnline") === "") {
          user.set("isOnline", false);
          changed = true;
        }
        
        // Set statusVisibility default
        if (user.get("statusVisibility") === undefined || user.get("statusVisibility") === null || user.get("statusVisibility") === "") {
          user.set("statusVisibility", "everyone");
          changed = true;
        }
        
        // Save if changes were made
        if (changed) {
          $app.save(user);
          updatedCount++;
        }
      }
      
      console.log(`Updated defaults for ${updatedCount} existing users`);
    } else {
      console.log("No users found needing default values");
    }
  } catch (err) {
    console.error(`Error during user defaults migration: ${err.message}`);
  }
  
  e.next();
});