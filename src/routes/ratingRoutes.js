const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader) {
        console.log('Aucun header Authorization trouvé');
        return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Token non trouvé dans le header');
        return res.status(401).json({ error: 'Token non fourni' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET non défini dans les variables d\'environnement');
            return res.status(500).json({ error: 'Erreur de configuration serveur' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé avec succès:', decoded);
        
        if (!decoded.id) {
            console.error('Token décodé ne contient pas d\'ID utilisateur');
            return res.status(401).json({ error: 'Token invalide' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        return res.status(401).json({ error: 'Token invalide' });
    }
};

// Add a rating to a movie
router.post('/:movieId', verifyToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        console.log('Données reçues:', { movieId, rating, userId });

        if (!userId) {
            console.error('ID utilisateur manquant');
            return res.status(401).json({ error: 'ID utilisateur manquant' });
        }

        // Vérifier si la note est valide (entre 1 et 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Vérifier si l'utilisateur a déjà noté ce film
        const existingRating = await db.get(
            'SELECT * FROM ratings WHERE user_id = ? AND film_id = ?',
            [userId, movieId]
        );

        if (existingRating) {
            // Mettre à jour la note existante
            await db.run(
                'UPDATE ratings SET rating = ? WHERE user_id = ? AND film_id = ?',
                [rating, userId, movieId]
            );
            return res.json({ message: 'Rating updated successfully' });
        }

        // Ajouter une nouvelle note
        await db.run(
            'INSERT INTO ratings (user_id, film_id, rating) VALUES (?, ?, ?)',
            [userId, movieId, rating]
        );

        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get average rating for a movie
router.get('/:movieId/average', async (req, res) => {
    try {
        const { movieId } = req.params;
        const result = await db.get(
            'SELECT AVG(rating) as averageRating, COUNT(*) as count FROM ratings WHERE film_id = ?',
            [movieId]
        );
        res.json({ 
            averageRating: result.averageRating || 0,
            count: result.count || 0
        });
    } catch (error) {
        console.error('Error getting average rating:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get user rating for a movie
router.get('/:movieId/user/:userId', verifyToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;
        const result = await db.get(
            'SELECT rating FROM ratings WHERE film_id = ? AND user_id = ?',
            [movieId, userId]
        );
        res.json({ rating: result ? result.rating : null });
    } catch (error) {
        console.error('Error getting rating:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router; 