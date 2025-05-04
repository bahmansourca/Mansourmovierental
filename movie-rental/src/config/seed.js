const db = require('./db');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        // Créer un utilisateur admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@example.com', hashedPassword, 'admin']
        );

        // Insérer des films de test
        const movies = [
            {
                title: 'The Matrix',
                description: 'Un programmeur découvre que la réalité est une simulation',
                release_year: 1999,
                genre: 'Science-Fiction',
                director: 'Lana et Lilly Wachowski',
                duration: 136,
                price: 3.99,
                stock: 5
            },
            {
                title: 'Inception',
                description: 'Un voleur qui vole des secrets via le partage de rêves',
                release_year: 2010,
                genre: 'Science-Fiction',
                director: 'Christopher Nolan',
                duration: 148,
                price: 4.99,
                stock: 3
            },
            {
                title: 'The Dark Knight',
                description: 'Batman affronte le Joker dans une bataille pour Gotham',
                release_year: 2008,
                genre: 'Action',
                director: 'Christopher Nolan',
                duration: 152,
                price: 4.99,
                stock: 0
            },
            {
                title: 'Pulp Fiction',
                description: 'Les vies de deux tueurs à gages, un boxeur et un gangster',
                release_year: 1994,
                genre: 'Crime',
                director: 'Quentin Tarantino',
                duration: 154,
                price: 3.99,
                stock: 2
            }
        ];

        for (const movie of movies) {
            await db.execute(
                'INSERT INTO movies (title, description, release_year, genre, director, duration, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [movie.title, movie.description, movie.release_year, movie.genre, movie.director, movie.duration, movie.price, movie.stock]
            );
        }

        console.log('Données de test insérées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données de test:', error);
    } finally {
        process.exit();
    }
};

seedData(); 