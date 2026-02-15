const { JsonDB, Config } = require("node-json-db");

const db = new JsonDB(new Config("ContentAutomationDB", true, false, "/"));

module.exports = db;
