const express = require('express');
const router = express.Router();
const db = require('../db/pgDatabase');

// Get all movies with optional search parameters
router.get('/', async (req, res) => {
    try {
        const { search, genre, director, actor } = req.query;
        let query = 'SELECT * FROM films WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (title ILIKE $' + (params.length + 1) + ' OR acteurs ILIKE $' + (params.length + 2) + ' OR realisateurs ILIKE $' + (params.length + 3) + ')';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        if (genre) {
            query += ' AND genre ILIKE $' + (params.length + 1);
            params.push(`%${genre}%`);
        }
        if (director) {
            query += ' AND realisateurs ILIKE $' + (params.length + 1);
            params.push(`%${director}%`);
        }
        if (actor) {
            query += ' AND acteurs ILIKE $' + (params.length + 1);
            params.push(`%${actor}%`);
        }

        const { rows: movies } = await db.query(query, params);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM films WHERE id = $1', [id]);
        const movie = rows[0];
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
        const { rows: movies } = await db.query('SELECT * FROM films WHERE available_copies > 0');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 