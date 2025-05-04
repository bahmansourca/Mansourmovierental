const db = require('../config/sqlite');
const bcrypt = require('bcrypt');

function safeCallback(cb) {
    return typeof cb === 'function' ? cb : () => {};
}

class User {
    static create({ name, email, password }, callback) {
        callback = safeCallback(callback);
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return callback(err);
            const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            db.run(sql, [name, email, hash], function(err) {
                callback(err, this ? this.lastID : null);
            });
        });
    }

    static getByEmail(email, callback) {
        callback = safeCallback(callback);
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            callback(err, row);
        });
    }

    static getById(id, callback) {
        callback = safeCallback(callback);
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            callback(err, row);
        });
    }

    static verifyPassword(user, password, callback) {
        callback = safeCallback(callback);
        bcrypt.compare(password, user.password, (err, res) => {
            callback(err, res);
        });
    }
}

module.exports = User; 