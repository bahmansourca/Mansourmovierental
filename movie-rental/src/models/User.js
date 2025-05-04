const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ name, email, password, role = 'user' }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await db.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (!rows || rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {
            console.error('Erreur lors de la recherche par email:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
            if (!rows || rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {
            console.error('Erreur lors de la recherche par id:', error);
            throw error;
        }
    }

    static async verifyPassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Erreur lors de la vérification du mot de passe:', error);
            throw error;
        }
    }
}

module.exports = User; 