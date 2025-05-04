const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Ensure ratings table exists
        db.run(`
            CREATE TABLE IF NOT EXISTS ratings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, movie_id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating ratings table:', err);
            } else {
                console.log('Ratings table created or already exists');
            }
        });
        // Create rentals table
        db.run(`CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            film_id INTEGER,
            rental_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            return_date DATETIME,
            UNIQUE(user_id, film_id, return_date)
        )`, (err) => {
            if (err) {
                console.error('Error creating rentals table:', err);
            } else {
                console.log('Rentals table created successfully');
            }
        });
    }
});

// Store original methods
const originalRun = db.run;
const originalGet = db.get;
const originalAll = db.all;

// Promisify database methods
db.run = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        originalRun.call(this, sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

db.get = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        originalGet.call(this, sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.all = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        originalAll.call(this, sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = db; 