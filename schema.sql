-- Table des users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_inscription DATE DEFAULT (DATE('now'))
);

-- Table des films
CREATE TABLE films (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

-- Table des rentals
CREATE TABLE rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    film_id INTEGER,
    rental_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(film_id) REFERENCES films(id)
);

-- Table des ratings
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    film_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, film_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(film_id) REFERENCES films(id)
); 