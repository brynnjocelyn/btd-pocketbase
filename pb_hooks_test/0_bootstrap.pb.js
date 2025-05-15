/// <reference path="../pb_data/types.d.ts" />

/**
 * Bootstrap file that logs the loading of JS hooks.
 *
 * PocketBase loads JS files alphabetically, so this file (0_bootstrap.pb.js)
 * will be loaded first.
 */

onBootstrap((e) => {
  console.log("=========== PocketBase hooks bootstrap started ===========");
  console.log("PB_HOOKS directory:", __hooks);

  try {
    // Check that we can load our module files
    try {
      const validators = require(`${__hooks}/file_validators.js`);
      console.log("✓ Loaded file_validators.js successfully");
      console.log("   Functions: ", Object.keys(validators).join(", "));
    } catch (err) {
      console.log("✗ Failed to load file_validators.js:", err.message);
    }

    try {
      const utils = require(`${__hooks}/messageUtils.js`);
      console.log("✓ Loaded messageUtils.js successfully");
      console.log("   Functions: ", Object.keys(utils).join(", "));
    } catch (err) {
      console.log("✗ Failed to load messageUtils.js:", err.message);
    }

  } catch (err) {
    console.log("✗ Module initialization error:", err.message);
  }

  console.log("===========================================================");

  e.next();
});