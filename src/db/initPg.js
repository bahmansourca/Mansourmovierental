const db = require('./pgDatabase');

async function initializeDatabase() {
  try {
    // Création des tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        date_inscription DATE DEFAULT CURRENT_DATE
      );
      CREATE TABLE IF NOT EXISTS films (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(255),
        annee_sortie INTEGER,
        langue_originale VARCHAR(100),
        pays_productions VARCHAR(255),
        acteurs TEXT,
        realisateurs VARCHAR(255),
        available_copies INTEGER DEFAULT 1,
        imgPath VARCHAR(500),
        trailer VARCHAR(500)
      );
      CREATE TABLE IF NOT EXISTS rentals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        film_id INTEGER REFERENCES films(id),
        rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        film_id INTEGER REFERENCES films(id),
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, film_id)
      );
    `);

    // Vérifier si la table films est vide
    const { rows } = await db.query('SELECT COUNT(*) FROM films');
    if (parseInt(rows[0].count, 10) === 0) {
      const movies = [
        {
          title: "Schindler's List",
          genre: "Biography, Drama, History, War",
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
          genre: "Crime, Thriller",
          annee_sortie: 1994,
          langue_originale: "English",
          pays_productions: "France",
          acteurs: "Jean Reno, Gary Oldman, Natalie Portman",
          realisateurs: "Luc Besson",
          available_copies: 2,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/0/03/Leon-poster.jpg",
          trailer: "https://www.youtube.com/embed/rNw0D7Hh0DY"
        },
        {
          title: "Pulp Fiction",
          genre: "Crime, Thriller",
          annee_sortie: 1994,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "John Travolta, Uma Thurman, Samuel L. Jackson",
          realisateurs: "Quentin Tarantino",
          available_copies: 3,
          imgPath: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
          trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY"
        },
        {
          title: "True Lies",
          genre: "Action, Comedy, Romance, Thriller",
          annee_sortie: 1994,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "Arnold Schwarzenegger, Jamie Lee Curtis, Tom Arnold",
          realisateurs: "James Cameron",
          available_copies: 2,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/7/7a/True_Lies_poster.jpg",
          trailer: "https://www.youtube.com/embed/3B8ocfB8jj4"
        },
        {
          title: "Teenage Mutant Ninja Turtles",
          genre: "Action, Adventure, Comedy, Crime, Drama, Family, Sci-Fi",
          annee_sortie: 1990,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "Judith Hoag, Elias Koteas, Josh Pais",
          realisateurs: "Steve Barron",
          available_copies: 3,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/8/8c/Teenage_Mutant_Ninja_Turtles_%281990_film%29_poster.jpg",
          trailer: "https://www.youtube.com/embed/FMJPwGoAfAk"
        },
        {
          title: "Fast & Furious",
          genre: "Action, Crime, Drama, Thriller",
          annee_sortie: 2009,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "Vin Diesel, Paul Walker, Michelle Rodriguez",
          realisateurs: "Justin Lin",
          available_copies: 4,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/8/8f/Fast_and_Furious_Poster.jpg",
          trailer: "https://www.youtube.com/embed/2TAOizOnNPo"
        },
        {
          title: "Hook",
          genre: "Adventure, Family, Fantasy",
          annee_sortie: 1991,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "Dustin Hoffman, Robin Williams, Julia Roberts",
          realisateurs: "Steven Spielberg",
          available_copies: 2,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/5/5a/Hook_film_poster.jpg",
          trailer: "https://www.youtube.com/embed/YoHD9XEInc0"
        },
        {
          title: "Sister Act",
          genre: "Comedy, Crime, Music",
          annee_sortie: 1992,
          langue_originale: "English",
          pays_productions: "USA",
          acteurs: "Whoopi Goldberg, Maggie Smith, Harvey Keitel",
          realisateurs: "Emile Ardolino",
          available_copies: 3,
          imgPath: "https://upload.wikimedia.org/wikipedia/en/1/1b/Sister_Act_poster.jpg",
          trailer: "https://www.youtube.com/embed/V6N6U7YVFyA"
        }
      ];
      for (const movie of movies) {
        await db.query(
          `INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [movie.title, movie.genre, movie.annee_sortie, movie.langue_originale, movie.pays_productions, movie.acteurs, movie.realisateurs, movie.available_copies, movie.imgPath, movie.trailer]
        );
      }
      console.log('Sample movies inserted');
    } else {
      console.log('Movies already exist in the database');
    }
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 