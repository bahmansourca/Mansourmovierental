const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Get user's current rentals
router.get('/my-rentals', auth, async (req, res) => {
    try {
        const rentals = await db.all(`
            SELECT r.*, f.title, f.imgPath 
            FROM rentals r
            JOIN films f ON r.film_id = f.id
            WHERE r.user_id = ? AND r.return_date IS NULL
        `, [req.user.id]);

        res.json(rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Rent a movie
router.post('/rent/:movieId', auth, async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        console.log('Renting movie:', { movieId, userId });

        // Check if user has less than 5 active rentals
        const activeRentals = await db.get(
            'SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND return_date IS NULL',
            [userId]
        );

        if (activeRentals.count >= 5) {
            return res.status(400).json({ error: 'You have reached the maximum number of rentals (5)' });
        }

        // Check if user already rented this movie
        const existingRental = await db.get(
            'SELECT * FROM rentals WHERE user_id = ? AND film_id = ? AND return_date IS NULL',
            [userId, movieId]
        );

        if (existingRental) {
            return res.status(400).json({ error: 'You have already rented this movie' });
        }

        // Check if movie is available
        const movie = await db.get('SELECT * FROM films WHERE id = ? AND available_copies > 0', [movieId]);
        if (!movie) {
            return res.status(400).json({ error: 'Movie is not available for rent' });
        }

        // Start transaction
        await db.run('BEGIN TRANSACTION');

        try {
            // Create rental
            await db.run(
                'INSERT INTO rentals (user_id, film_id) VALUES (?, ?)',
                [userId, movieId]
            );

            // Decrease available copies
            await db.run(
                'UPDATE films SET available_copies = available_copies - 1 WHERE id = ?',
                [movieId]
            );

            await db.run('COMMIT');
            res.json({ message: 'Movie rented successfully' });
        } catch (error) {
            await db.run('ROLLBACK');
            console.error('Transaction error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Rental error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Return a movie
router.post('/return/:rentalId', auth, async (req, res) => {
    try {
        const { rentalId } = req.params;
        const userId = req.user.userId;

        // Check if rental exists and belongs to user
        const rental = await db.get(
            'SELECT * FROM rentals WHERE id = ? AND user_id = ? AND return_date IS NULL',
            [rentalId, userId]
        );

        if (!rental) {
            return res.status(404).json({ error: 'Rental not found or already returned' });
        }

        // Start transaction
        await db.run('BEGIN TRANSACTION');

        try {
            // Update rental return date
            await db.run(
                'UPDATE rentals SET return_date = CURRENT_TIMESTAMP WHERE id = ?',
                [rentalId]
            );

            // Increase available copies
            await db.run(
                'UPDATE films SET available_copies = available_copies + 1 WHERE id = ?',
                [rental.film_id]
            );

            await db.run('COMMIT');
            res.json({ message: 'Movie returned successfully' });
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 