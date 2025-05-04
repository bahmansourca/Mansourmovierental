const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get user's rentals
router.get('/my-rentals', auth, async (req, res) => {
    try {
        const [rentals] = await db.query(`
            SELECT r.*, f.title, f.imgPath 
            FROM rentals r
            JOIN films f ON r.film_id = f.id
            WHERE r.user_id = ? AND r.return_date IS NULL
        `, [req.user.userId]);

        res.json(rentals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rent a film
router.post('/rent/:filmId', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const filmId = req.params.filmId;

        // Check if user has less than 5 active rentals
        const [activeRentals] = await db.query(`
            SELECT COUNT(*) as count FROM rentals 
            WHERE user_id = ? AND return_date IS NULL
        `, [userId]);

        if (activeRentals[0].count >= 5) {
            return res.status(400).json({ message: 'You cannot rent more than 5 films at a time' });
        }

        // Check if film is already rented by user
        const [existingRental] = await db.query(`
            SELECT * FROM rentals 
            WHERE user_id = ? AND film_id = ? AND return_date IS NULL
        `, [userId, filmId]);

        if (existingRental.length > 0) {
            return res.status(400).json({ message: 'You have already rented this film' });
        }

        // Check if film is available
        const [film] = await db.query('SELECT available_copies FROM films WHERE id = ?', [filmId]);
        if (film[0].available_copies <= 0) {
            return res.status(400).json({ message: 'No copies available for this film' });
        }

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            // Create rental
            await db.query(`
                INSERT INTO rentals (user_id, film_id) 
                VALUES (?, ?)
            `, [userId, filmId]);

            // Update available copies
            await db.query(`
                UPDATE films 
                SET available_copies = available_copies - 1 
                WHERE id = ?
            `, [filmId]);

            await db.query('COMMIT');
            res.status(201).json({ message: 'Film rented successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Return a film
router.post('/return/:rentalId', auth, async (req, res) => {
    try {
        const rentalId = req.params.rentalId;
        const userId = req.user.userId;

        // Check if rental exists and belongs to user
        const [rental] = await db.query(`
            SELECT * FROM rentals 
            WHERE id = ? AND user_id = ? AND return_date IS NULL
        `, [rentalId, userId]);

        if (rental.length === 0) {
            return res.status(404).json({ message: 'Rental not found or already returned' });
        }

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            // Update rental return date
            await db.query(`
                UPDATE rentals 
                SET return_date = CURRENT_TIMESTAMP 
                WHERE id = ?
            `, [rentalId]);

            // Update available copies
            await db.query(`
                UPDATE films 
                SET available_copies = available_copies + 1 
                WHERE id = ?
            `, [rental[0].film_id]);

            await db.query('COMMIT');
            res.json({ message: 'Film returned successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 