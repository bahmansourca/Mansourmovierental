const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Get all movies with optional search parameters
router.get('/', async (req, res) => {
    try {
        const { search, genre, director, actor } = req.query;
        let query = 'SELECT * FROM films WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (title LIKE ? OR acteurs LIKE ? OR realisateurs LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (genre) {
            query += ' AND genre LIKE ?';
            params.push(`%${genre}%`);
        }

        if (director) {
            query += ' AND realisateurs LIKE ?';
            params.push(`%${director}%`);
        }

        if (actor) {
            query += ' AND acteurs LIKE ?';
            params.push(`%${actor}%`);
        }

        const movies = await db.all(query, params);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await db.get('SELECT * FROM films WHERE id = ?', [id]);
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get available movies
router.get('/available', async (req, res) => {
    try {
        const movies = await db.all('SELECT * FROM films WHERE available_copies > 0');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Rate a movie
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user.userId;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }
        // Vérifier si le film existe
        const film = await db.get('SELECT * FROM films WHERE id = ?', [id]);
        if (!film) {
            return res.status(404).json({ error: 'Film non trouvé.' });
        }
        // Insérer ou mettre à jour la note
        await db.run(
            `INSERT INTO ratings (user_id, film_id, rating) VALUES (?, ?, ?)
            ON CONFLICT(user_id, film_id) DO UPDATE SET rating=excluded.rating, created_at=CURRENT_TIMESTAMP`,
            [userId, id, rating]
        );
        res.json({ message: 'Rating saved!' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la notation.' });
    }
});

module.exports = router; 