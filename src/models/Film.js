const db = require('../config/sqlite');

class Film {
    static create(film, callback) {
        const sql = `INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [film.title, film.genre, film.annee_sortie, film.langue_originale, film.pays_productions, film.acteurs, film.realisateurs, film.available_copies, film.imgPath, film.trailer];
        db.run(sql, params, function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    static getAll(callback) {
        db.all('SELECT * FROM films', [], (err, rows) => {
            callback(err, rows);
        });
    }

    static getById(id, callback) {
        db.get('SELECT * FROM films WHERE id = ?', [id], (err, row) => {
            callback(err, row);
        });
    }

    static search(query, callback) {
        const q = `%${query}%`;
        db.all('SELECT * FROM films WHERE title LIKE ? OR genre LIKE ? OR realisateurs LIKE ? OR acteurs LIKE ?', [q, q, q, q], (err, rows) => {
            callback(err, rows);
        });
    }

    static getGenres(callback) {
        db.all('SELECT DISTINCT genre FROM films', [], (err, rows) => {
            callback(err, rows.map(r => r.genre));
        });
    }
}

module.exports = Film; 