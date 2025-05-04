const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const movieRoutes = require('./src/routes/movieRoutes');
const rentalRoutes = require('./src/routes/rentalRoutes');

const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Log des requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);

// Routes statiques
app.get('/login', (req, res) => {
    console.log('Accès à la page de connexion');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    console.log('Accès à la page d\'inscription');
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/movies', (req, res) => {
    console.log('Accès à la page des films');
    res.sendFile(path.join(__dirname, 'public', 'movies.html'));
});

app.get('/logout', (req, res) => {
    res.redirect('/login');
});

// Route par défaut
app.get('/', (req, res) => {
    console.log('Accès à la page d\'accueil');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Testez la connexion avec:');
    console.log('1. http://localhost:3000/');
    console.log('2. http://localhost:3000/login');
    console.log('3. http://localhost:3000/register');
    console.log('4. http://localhost:3000/movies');
}); 