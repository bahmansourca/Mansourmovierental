const express = require('express');
const router = express.Router();
const db = require('../db/pgDatabase');
const auth = require('../middleware/auth');

// Lister les locations de l'utilisateur connecté
router.get('/my-rentals', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { rows } = await db.query(
            `SELECT r.*, f.title, f.imgPath, f.genre, f.annee_sortie
             FROM rentals r
             JOIN films f ON r.film_id = f.id
             WHERE r.user_id = $1 AND r.return_date IS NULL`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des locations.' });
    }
});

// Louer un film
router.post('/rent', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { filmId } = req.body;
        // Vérifier si le film existe et a des copies disponibles
        const { rows: films } = await db.query('SELECT * FROM films WHERE id = $1', [filmId]);
        const film = films[0];
        if (!film) {
            return res.status(404).json({ error: 'Film non trouvé.' });
        }
        if (film.available_copies < 1) {
            return res.status(400).json({ error: 'Aucune copie disponible.' });
        }
        // Créer la location
        const { rows } = await db.query(
            'INSERT INTO rentals (user_id, film_id) VALUES ($1, $2) RETURNING *',
            [userId, filmId]
        );
        // Décrémenter le nombre de copies disponibles
        await db.query('UPDATE films SET available_copies = available_copies - 1 WHERE id = $1', [filmId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error renting movie:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la location.' });
    }
});

// Retourner un film
router.post('/return/:id', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const rentalId = req.params.id;
        // Vérifier la location
        const { rows: rentals } = await db.query('SELECT * FROM rentals WHERE id = $1 AND user_id = $2', [rentalId, userId]);
        const rental = rentals[0];
        if (!rental) {
            return res.status(404).json({ error: 'Location non trouvée.' });
        }
        if (rental.return_date) {
            return res.status(400).json({ error: 'Film déjà retourné.' });
        }
        // Marquer comme retourné
        await db.query('UPDATE rentals SET return_date = CURRENT_TIMESTAMP WHERE id = $1', [rentalId]);
        // Incrémenter le nombre de copies disponibles
        await db.query('UPDATE films SET available_copies = available_copies + 1 WHERE id = $1', [rental.film_id]);
        res.json({ message: 'Film retourné avec succès.' });
    } catch (error) {
        console.error('Error returning movie:', error);
        res.status(500).json({ error: 'Erreur serveur lors du retour.' });
    }
});

module.exports = router; 