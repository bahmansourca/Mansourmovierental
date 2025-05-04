const express = require('express');
const router = express.Router();
const db = require('../db/pgDatabase');
const auth = require('../middleware/auth');

// Récupérer le profil de l'utilisateur connecté
router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { rows } = await db.query('SELECT id, name, email, date_inscription FROM users WHERE id = $1', [userId]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil.' });
    }
});

// Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Nom et email requis.' });
        }
        await db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
        res.json({ message: 'Profil mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil.' });
    }
});

module.exports = router; 