const express = require('express');
const router = express.Router();
const db = require('../db/pgDatabase');
const auth = require('../middleware/auth');

// Noter un film
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const filmId = req.params.id;
        const userId = req.user.id;
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5.' });
        }
        // Vérifier si le film existe
        const { rows: films } = await db.query('SELECT * FROM films WHERE id = $1', [filmId]);
        if (films.length === 0) {
            return res.status(404).json({ error: 'Film non trouvé.' });
        }
        // Insérer ou mettre à jour la note
        await db.query(
            `INSERT INTO ratings (user_id, film_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, film_id) DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP`,
            [userId, filmId, rating]
        );
        res.json({ message: 'Note enregistrée !' });
    } catch (error) {
        console.error('Erreur lors de la notation :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la notation.' });
    }
});

// Obtenir la moyenne des notes d'un film
router.get('/:id/average-rating', async (req, res) => {
    try {
        const filmId = req.params.id;
        const { rows } = await db.query('SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE film_id = $1', [filmId]);
        const average = rows[0].average ? parseFloat(rows[0].average).toFixed(2) : 0;
        const count = parseInt(rows[0].count, 10);
        res.json({ average, count });
    } catch (error) {
        console.error('Erreur lors de la récupération de la moyenne :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la moyenne.' });
    }
});

module.exports = router; 