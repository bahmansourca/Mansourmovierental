const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Migration automatique : création des tables si elles n'existent pas
async function migrate() {
  // Adaptation du SQL pour PostgreSQL
  const migrationSQL = `
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
      user_id INTEGER NOT NULL REFERENCES users(id),
      film_id INTEGER NOT NULL REFERENCES films(id),
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, film_id)
    );
  `;
  try {
    await pool.query(migrationSQL);
    console.log('Migration PostgreSQL terminée.');
  } catch (err) {
    console.error('Erreur migration PostgreSQL:', err);
  }
}

// Exécuter la migration au démarrage
migrate().then(async () => {
  // Vérifier si la table films est vide
  const { rows } = await pool.query('SELECT COUNT(*) FROM films');
  if (parseInt(rows[0].count, 10) === 0) {
    // Insérer les 9 films de test avec les bons chemins d'images
    await pool.query(`
      INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer) VALUES
      ('Schindler''s List', 'Biography,Drama,History,War', 1993, 'English', 'USA', 'Liam Neeson,Ben Kingsley,Ralph Fiennes', 'Steven Spielberg', 5, 'images/movies/schindlers-list.jpg', 'https://www.youtube.com/watch?v=gG22XNhtnoY'),
      ('Twilight', 'Drama,Fantasy,Romance', 2008, 'English', 'USA', 'Kristen Stewart,Robert Pattinson,Taylor Lautner', 'Catherine Hardwicke', 5, 'images/movies/twilight.jpg', 'https://www.youtube.com/watch?v=uxjNDE2fMjI'),
      ('Léon', 'Crime,Thriller', 1994, 'French', 'France', 'Jean Reno,Gary Oldman,Natalie Portman', 'Luc Besson', 5, 'images/movies/leon.jpg', 'https://www.youtube.com/watch?v=aNQqoExfQsg'),
      ('Pulp Fiction', 'Crime,Thriller', 1994, 'English', 'USA', 'John Travolta,Uma Thurman,Samuel L. Jackson', 'Quentin Tarantino', 5, 'images/movies/pulp-fiction.jpg', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY'),
      ('True Lies', 'Action,Comedy,Romance,Thriller', 1994, 'English', 'USA', 'Arnold Schwarzenegger,Jamie Lee Curtis,Tom Arnold', 'James Cameron', 5, 'images/movies/true-lies.jpg', 'https://www.youtube.com/watch?v=Wy4YhRcgGds'),
      ('Teenage Mutant Ninja Turtles', 'Action,Adventure,Comedy,Crime,Drama,Family,Sci-Fi', 1990, 'English', 'USA', 'Judith Hoag,Elias Koteas,Josh Pais', 'Steve Barron', 5, 'images/movies/teenage-mutant-ninja-turtles.jpg', 'https://www.youtube.com/watch?v=FMJPwRWaZBI'),
      ('Fast & Furious', 'Action,Crime,Drama,Thriller', 2009, 'English', 'USA', 'Vin Diesel,Paul Walker,Michelle Rodriguez', 'Justin Lin', 5, 'images/movies/fast-&-furious.jpg', 'https://www.youtube.com/watch?v=2TAOizOnNPo'),
      ('Hook', 'Adventure,Family,Fantasy', 1991, 'English', 'USA', 'Dustin Hoffman,Robin Williams,Julia Roberts', 'Steven Spielberg', 5, 'images/movies/hook.jpg', 'https://www.youtube.com/watch?v=5gO2FcpQ7pU'),
      ('Sister Act', 'Comedy,Crime,Music', 1992, 'English', 'USA', 'Whoopi Goldberg,Maggie Smith,Kathy Najimy', 'Emile Ardolino', 5, 'images/movies/sister-act.jpg', 'https://www.youtube.com/watch?v=QJtV2ubxU4E')
    `);
    console.log('Films de test insérés dans la base PostgreSQL.');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 