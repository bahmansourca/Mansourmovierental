const Rental = require('../models/Rental');
const Movie = require('../models/Movie');

class RentalController {
    static async rentMovie(req, res) {
        try {
            const { movie_id } = req.body;
            const user_id = req.user.id;

            // Vérifier si le film existe
            const movie = await Movie.findById(movie_id);
            if (!movie) {
                return res.status(404).json({ message: 'Film non trouvé' });
            }

            try {
                // Créer la location (les vérifications sont faites dans le modèle)
                const rentalId = await Rental.create({ user_id, movie_id });
                
                res.status(201).json({
                    message: 'Film loué avec succès',
                    rentalId
                });
            } catch (error) {
                // Gérer les erreurs spécifiques des règles métiers
                if (error.message.includes('limite de 5 locations')) {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message.includes('déjà loué')) {
                    return res.status(400).json({ message: error.message });
                }
                if (error.message.includes('plus disponible')) {
                    return res.status(400).json({ message: error.message });
                }
                throw error;
            }
        } catch (error) {
            console.error('Erreur lors de la location du film:', error);
            res.status(500).json({ message: 'Erreur lors de la location du film' });
        }
    }

    static async returnMovie(req, res) {
        try {
            const rentalId = req.params.id;
            const user_id = req.user.id;

            // Vérifier si la location existe et appartient à l'utilisateur
            const rental = await Rental.findById(rentalId);
            if (!rental) {
                return res.status(404).json({ message: 'Location non trouvée' });
            }
            if (rental.user_id !== user_id) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }
            if (rental.status === 'returned') {
                return res.status(400).json({ message: 'Ce film a déjà été retourné' });
            }

            // Marquer le film comme retourné (la mise à jour du stock est gérée dans le modèle)
            await Rental.returnMovie(rentalId);

            res.json({ message: 'Film retourné avec succès' });
        } catch (error) {
            console.error('Erreur lors du retour du film:', error);
            res.status(500).json({ message: 'Erreur lors du retour du film' });
        }
    }

    static async getUserRentals(req, res) {
        try {
            const user_id = req.user.id;
            const rentals = await Rental.findByUserId(user_id);
            
            // Formater la réponse pour inclure plus d'informations
            const formattedRentals = rentals.map(rental => ({
                id: rental.id,
                movie: {
                    id: rental.movie_id,
                    title: rental.title,
                    price: rental.price
                },
                rental_date: rental.rental_date,
                return_date: rental.return_date,
                status: rental.status
            }));

            res.json(formattedRentals);
        } catch (error) {
            console.error('Erreur lors de la récupération des locations:', error);
            res.status(500).json({ message: 'Erreur lors de la récupération des locations' });
        }
    }
}

module.exports = RentalController; 