const Database = require("better-sqlite3")

const db = new Database("hue.db")

db.exec(`
    CREATE TABLE IF NOT EXISTS presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        data JSON not null,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`)

module.exports = db;