const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all films
router.get('/', async (req, res) => {
    try {
        const [films] = await db.query('SELECT * FROM films');
        res.json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get film by ID
router.get('/:id', async (req, res) => {
    try {
        const [films] = await db.query('SELECT * FROM films WHERE id = ?', [req.params.id]);
        if (films.length === 0) {
            return res.status(404).json({ message: 'Film not found' });
        }
        res.json(films[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search films
router.get('/search/:query', async (req, res) => {
    try {
        const query = `%${req.params.query}%`;
        const [films] = await db.query(`
            SELECT * FROM films 
            WHERE title LIKE ? 
            OR genre LIKE ? 
            OR realisateurs LIKE ? 
            OR acteurs LIKE ?
        `, [query, query, query, query]);
        res.json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new film (admin only)
router.post('/', async (req, res) => {
    try {
        const {
            title,
            genre,
            annee_sortie,
            langue_originale,
            pays_productions,
            acteurs,
            realisateurs,
            available_copies,
            imgPath,
            trailer
        } = req.body;

        await db.query(`
            INSERT INTO films (
                title, genre, annee_sortie, langue_originale, 
                pays_productions, acteurs, realisateurs, 
                available_copies, imgPath, trailer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title, genre, annee_sortie, langue_originale,
            pays_productions, acteurs, realisateurs,
            available_copies, imgPath, trailer
        ]);

        res.status(201).json({ message: 'Film added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 