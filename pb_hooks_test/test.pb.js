/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
  console.log("Test hook loaded successfully");
  e.next();
});