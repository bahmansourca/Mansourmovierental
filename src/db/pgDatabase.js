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
migrate();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 