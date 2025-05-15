/// <reference path="../pb_data/types.d.ts" />

/**
 * Custom admin routes for API documentation
 * 
 * This file sets up an admin-only route for documentation access.
 */

// Simple bootstrap marker to show the file is loaded
onBootstrap(function(e) {
  console.log("Admin documentation will be available at /api_docs.html");
  
  // Just continue the bootstrap process
  e.next();
});