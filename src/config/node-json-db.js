const { JsonDB, Config } = require("node-json-db");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/content-automation.json");
const db = new JsonDB(new Config(dbPath, true, false, "/"));

module.exports = db;
