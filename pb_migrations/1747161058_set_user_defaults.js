/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration to set default values for existing users
 * Sets isOnline = false and statusVisibility = "everyone" for users missing these values
 */
migrate((app) => {
  console.log("Running migration to set default isOnline and statusVisibility for existing users...");
  
  // Find all users that need defaults
  const users = app.findRecordsByFilter(
    "users", 
    "isOnline = '' || isOnline = null || statusVisibility = '' || statusVisibility = null"
  );
  
  console.log(`Found ${users.length} total users to process`);
  
  let updatedCount = 0;
  
  // Update each user with defaults
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let changed = false;
    
    // Set isOnline default to false if not already set
    if (user.get("isOnline") === undefined || user.get("isOnline") === null || user.get("isOnline") === "") {
      user.set("isOnline", false);
      changed = true;
    }
    
    // Set statusVisibility default to "everyone" if not already set
    if (user.get("statusVisibility") === undefined || user.get("statusVisibility") === null || user.get("statusVisibility") === "") {
      user.set("statusVisibility", "everyone");
      changed = true;
    }
    
    // Save if changes were made
    if (changed) {
      try {
        app.save(user);
        updatedCount++;
      } catch (err) {
        console.error(`Error saving user ${user.id}: ${err.message}`);
      }
    }
  }
  
  console.log(`Migration completed - Updated ${updatedCount} users with default values`);
});