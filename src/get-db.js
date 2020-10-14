const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
function getDb(path_to_db) {
  const database_filename = path.join(__dirname, path_to_db)
  const adapter = new FileSync(database_filename)
  const db = low(adapter)
  return db;
}

module.exports = getDb