require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutesPg');
const movieRoutes = require('./src/routes/movieRoutesPg');
const rentalRoutes = require('./src/routes/rentalRoutesPg');
const userRoutes = require('./src/routes/userRoutesPg');
const ratingRoutes = require('./src/routes/ratingRoutesPg');

// Initialisation de la base de données
// require('./src/db/init.js'); // SQLite (désactivé)
// require('./src/db/initPg.js'); // PostgreSQL (à lancer manuellement si besoin)

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);

// Route pour servir l'index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour servir login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour servir register.html
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Route pour servir movies.html
app.get('/movies.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'movies.html'));
});

// Route pour servir profile.html
app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('Starting server...');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to test the API`);
}); 