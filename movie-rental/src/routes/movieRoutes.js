const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Routes publiques
router.get('/', MovieController.getAllMovies);
router.get('/:id', MovieController.getMovieById);

// Routes protégées (admin uniquement)
router.post('/', authMiddleware, adminMiddleware, MovieController.createMovie);
router.put('/:id', authMiddleware, adminMiddleware, MovieController.updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, MovieController.deleteMovie);

module.exports = router; 