const db = require("../config/db");

const migrations = [
  require("./001_create_task"),
  // Add more migration files here as needed
];

migrations.forEach((migration) => 
    {
        migration.run();// create taks table
    });