const db = require('../config/db');

class Movie {
    static async execute(query, params = []) {
        return await db.execute(query, params);
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM movies');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByGenre(genre) {
        const [rows] = await db.execute('SELECT * FROM movies WHERE genre = ?', [genre]);
        return rows;
    }

    static async findAvailable() {
        const [rows] = await db.execute('SELECT * FROM movies WHERE stock > 0');
        return rows;
    }

    static async search(query) {
        const searchQuery = `%${query}%`;
        const [rows] = await db.execute(
            'SELECT * FROM movies WHERE title LIKE ? OR description LIKE ? OR director LIKE ?',
            [searchQuery, searchQuery, searchQuery]
        );
        return rows;
    }

    static async create({ title, description, release_year, genre, director, duration, price, stock, image_url }) {
        const [result] = await db.execute(
            'INSERT INTO movies (title, description, release_year, genre, director, duration, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, release_year, genre, director, duration, price, stock, image_url]
        );
        return result.insertId;
    }

    static async update(id, { title, description, release_year, genre, director, duration, price, stock, image_url }) {
        await db.execute(
            'UPDATE movies SET title = ?, description = ?, release_year = ?, genre = ?, director = ?, duration = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
            [title, description, release_year, genre, director, duration, price, stock, image_url, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM movies WHERE id = ?', [id]);
    }

    static async updateStock(id, newStock) {
        await this.execute('UPDATE movies SET stock = ? WHERE id = ?', [newStock, id]);
    }
}

module.exports = Movie; 