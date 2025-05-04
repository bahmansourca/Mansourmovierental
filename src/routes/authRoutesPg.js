const express = require('express');
const router = express.Router();
const db = require('../db/pgDatabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, date_inscription',
            [name, email, hashedPassword]
        );
        const user = rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, date_inscription: user.date_inscription } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
    }
});

module.exports = router; 