const db = require('./database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        // Read and execute schema (chaque requête séparément)
        const schema = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');
        // Supprimer toutes les lignes de commentaires
        const cleanedSchema = schema
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n');
        const statements = cleanedSchema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length);
        for (const stmt of statements) {
            await db.run(stmt);
        }

        // Vérifier si la table films est vide
        const count = await db.get('SELECT COUNT(*) as count FROM films');
        if (count.count === 0) {
            // Insert sample movies
            const movies = [
                {
                    title: "Avatar",
                    genre: "Action, Adventure, Fantasy",
                    annee_sortie: 2009,
                    langue_originale: "English",
                    pays_productions: "USA",
                    acteurs: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
                    realisateurs: "James Cameron",
                    available_copies: 3,
                    imgPath: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
                    trailer: "https://www.youtube.com/embed/5e8T3dYdXq0"
                },
                {
                    title: "Schindler's List",
                    genre: "Biography, Drama, History",
                    annee_sortie: 1993,
                    langue_originale: "English",
                    pays_productions: "USA",
                    acteurs: "Liam Neeson, Ralph Fiennes, Ben Kingsley",
                    realisateurs: "Steven Spielberg",
                    available_copies: 2,
                    imgPath: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
                    trailer: "https://www.youtube.com/embed/gG22XNhtnoY"
                },
                {
                    title: "Twilight",
                    genre: "Drama, Fantasy, Romance",
                    annee_sortie: 2008,
                    langue_originale: "English",
                    pays_productions: "USA",
                    acteurs: "Kristen Stewart, Robert Pattinson, Taylor Lautner",
                    realisateurs: "Catherine Hardwicke",
                    available_copies: 4,
                    imgPath: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_.jpg",
                    trailer: "https://www.youtube.com/embed/uxjNDE2fMjI"
                },
                {
                    title: "Léon",
                    genre: "Action, Crime, Drama",
                    annee_sortie: 1994,
                    langue_originale: "English",
                    pays_productions: "France",
                    acteurs: "Jean Reno, Gary Oldman, Natalie Portman",
                    realisateurs: "Luc Besson",
                    available_copies: 2,
                    imgPath: "https://m.media-amazon.com/images/M/MV5BODg3MGNhYjItZGU2Yi00MzU0LThlYWUtYjQyYjVhZWEwYjVlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
                    trailer: "https://www.youtube.com/embed/rNw0D7Hh0DY"
                },
                {
                    title: "Pulp Fiction",
                    genre: "Crime, Drama",
                    annee_sortie: 1994,
                    langue_originale: "English",
                    pays_productions: "USA",
                    acteurs: "John Travolta, Uma Thurman, Samuel L. Jackson",
                    realisateurs: "Quentin Tarantino",
                    available_copies: 3,
                    imgPath: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
                    trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY"
                }
            ];

            for (const movie of movies) {
                await db.run(
                    `INSERT INTO films (
                        title, genre, annee_sortie, langue_originale, pays_productions,
                        acteurs, realisateurs, available_copies, imgPath, trailer
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        movie.title,
                        movie.genre,
                        movie.annee_sortie,
                        movie.langue_originale,
                        movie.pays_productions,
                        movie.acteurs,
                        movie.realisateurs,
                        movie.available_copies,
                        movie.imgPath,
                        movie.trailer
                    ]
                );
            }
            console.log('Sample movies inserted');
        } else {
            console.log('Movies already exist in the database');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Run initialization
initializeDatabase(); 