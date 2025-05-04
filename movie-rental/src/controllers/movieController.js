const Movie = require('../models/Movie');

class MovieController {
    static async getAllMovies(req, res) {
        try {
            const { genre, available, search } = req.query;
            let query = 'SELECT * FROM movies';
            const params = [];

            if (genre || available === 'true' || search) {
                query += ' WHERE';
                const conditions = [];

                if (genre) {
                    conditions.push(' genre = ?');
                    params.push(genre);
                }
                if (available === 'true') {
                    conditions.push(' stock > 0');
                }
                if (search) {
                    conditions.push(' (title LIKE ? OR description LIKE ? OR director LIKE ?)');
                    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
                }

                query += conditions.join(' AND');
            }

            const movies = await Movie.execute(query, params);
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des films' });
        }
    }

    static async getMovieById(req, res) {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({ message: 'Film non trouvé' });
            }
            res.json(movie);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération du film' });
        }
    }

    static async createMovie(req, res) {
        try {
            const movieData = req.body;
            const movieId = await Movie.create(movieData);
            res.status(201).json({ 
                message: 'Film créé avec succès',
                movieId 
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création du film' });
        }
    }

    static async updateMovie(req, res) {
        try {
            const movieId = req.params.id;
            const movieData = req.body;
            
            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Film non trouvé' });
            }

            await Movie.update(movieId, movieData);
            res.json({ message: 'Film mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du film' });
        }
    }

    static async deleteMovie(req, res) {
        try {
            const movieId = req.params.id;
            
            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Film non trouvé' });
            }

            await Movie.delete(movieId);
            res.json({ message: 'Film supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression du film' });
        }
    }
}

module.exports = MovieController; 