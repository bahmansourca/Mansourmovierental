const db = require('../config/db');

class Rental {
    static async create({ user_id, movie_id }) {
        // Vérifier si l'utilisateur a déjà 5 locations actives
        const activeRentals = await this.getActiveRentalsCount(user_id);
        if (activeRentals >= 5) {
            throw new Error('Vous avez atteint la limite de 5 locations actives');
        }

        // Vérifier si l'utilisateur a déjà loué ce film
        const existingRental = await this.findActiveRentalByUserAndMovie(user_id, movie_id);
        if (existingRental) {
            throw new Error('Vous avez déjà loué ce film');
        }

        // Vérifier la disponibilité du film
        const [movie] = await db.execute('SELECT stock FROM movies WHERE id = ?', [movie_id]);
        if (!movie || movie[0].stock <= 0) {
            throw new Error('Ce film n\'est plus disponible');
        }

        // Démarrer la transaction
        await db.beginTransaction();
        try {
            // Créer la location
            const [result] = await db.execute(
                'INSERT INTO rentals (user_id, movie_id, rental_date, status) VALUES (?, ?, CURRENT_TIMESTAMP, "active")',
                [user_id, movie_id]
            );

            // Mettre à jour le stock
            await db.execute(
                'UPDATE movies SET stock = stock - 1 WHERE id = ?',
                [movie_id]
            );

            await db.commit();
            return result.insertId;
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }

    static async getActiveRentalsCount(user_id) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND status = "active"',
            [user_id]
        );
        return rows[0].count;
    }

    static async findActiveRentalByUserAndMovie(user_id, movie_id) {
        const [rows] = await db.execute(
            'SELECT * FROM rentals WHERE user_id = ? AND movie_id = ? AND status = "active"',
            [user_id, movie_id]
        );
        return rows[0];
    }

    static async findByUserId(user_id) {
        const [rows] = await db.execute(
            `SELECT r.*, m.title, m.price 
             FROM rentals r 
             JOIN movies m ON r.movie_id = m.id 
             WHERE r.user_id = ?`,
            [user_id]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT r.*, m.title, m.price 
             FROM rentals r 
             JOIN movies m ON r.movie_id = m.id 
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async returnMovie(rental_id) {
        await db.beginTransaction();
        try {
            // Récupérer l'ID du film
            const [rental] = await db.execute(
                'SELECT movie_id FROM rentals WHERE id = ?',
                [rental_id]
            );

            if (!rental || rental.length === 0) {
                throw new Error('Location non trouvée');
            }

            // Mettre à jour le statut de la location
            await db.execute(
                'UPDATE rentals SET status = "returned", return_date = CURRENT_TIMESTAMP WHERE id = ?',
                [rental_id]
            );

            // Augmenter le stock du film
            await db.execute(
                'UPDATE movies SET stock = stock + 1 WHERE id = ?',
                [rental[0].movie_id]
            );

            await db.commit();
        } catch (error) {
            await db.rollback();
            throw error;
        }
    }

    static async checkOverdueRentals() {
        const [rows] = await db.execute(
            `UPDATE rentals 
             SET status = "overdue" 
             WHERE status = "active" 
             AND rental_date < DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );
        return rows.affectedRows;
    }
}

module.exports = Rental; 