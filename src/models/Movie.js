class Movie {
  static movies = [
    {
      id: 1,
      title: "Inception",
      description: "Un voleur qui s'infiltre dans les rêves des autres est chargé de planter une idée dans l'esprit d'un PDG.",
      genre: "Science-Fiction",
      director: "Christopher Nolan",
      releaseYear: 2010,
      imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
      stock: 5
    },
    {
      id: 2,
      title: "The Dark Knight",
      description: "Batman, avec l'aide du lieutenant Jim Gordon et du procureur Harvey Dent, lutte contre le criminel Joker.",
      genre: "Action",
      director: "Christopher Nolan",
      releaseYear: 2008,
      imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7aReWfGye.jpg",
      trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
      stock: 3
    },
    {
      id: 3,
      title: "Interstellar",
      description: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace pour sauver l'humanité.",
      genre: "Science-Fiction",
      director: "Christopher Nolan",
      releaseYear: 2014,
      imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
      stock: 4
    },
    {
      id: 4,
      title: "The Shawshank Redemption",
      description: "Deux hommes emprisonnés se lient d'amitié, trouvant réconfort et rédemption finale.",
      genre: "Drame",
      director: "Frank Darabont",
      releaseYear: 1994,
      imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
      stock: 2
    },
    {
      id: 5,
      title: "Pulp Fiction",
      description: "Les vies de deux tueurs à gages, d'un boxeur, d'un gangster et de sa femme s'entrecroisent.",
      genre: "Crime",
      director: "Quentin Tarantino",
      releaseYear: 1994,
      imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
      stock: 3
    },
    {
      id: 6,
      title: "The Godfather",
      description: "Le patriarche vieillissant d'une dynastie criminelle transfère le contrôle de son empire à son fils réticent.",
      genre: "Crime",
      director: "Francis Ford Coppola",
      releaseYear: 1972,
      imageUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      trailerUrl: "https://www.youtube.com/embed/sY1S34973zA",
      stock: 2
    },
    {
      id: 7,
      title: "Fight Club",
      description: "Un employé de bureau insomniaque et un fabricant de savon anarchiste forment un club de combat clandestin.",
      genre: "Drame",
      director: "David Fincher",
      releaseYear: 1999,
      imageUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      trailerUrl: "https://www.youtube.com/embed/qtRKdVHc-cE",
      stock: 4
    },
    {
      id: 8,
      title: "The Matrix",
      description: "Un pirate informatique découvre que la réalité est une simulation contrôlée par des machines intelligentes.",
      genre: "Science-Fiction",
      director: "Lana Wachowski, Lilly Wachowski",
      releaseYear: 1999,
      imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
      stock: 3
    },
    {
      id: 9,
      title: "Forrest Gump",
      description: "L'histoire d'un homme simple d'esprit qui vit des événements historiques extraordinaires.",
      genre: "Drame",
      director: "Robert Zemeckis",
      releaseYear: 1994,
      imageUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
      trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
      stock: 4
    },
    {
      id: 10,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      description: "Un hobbit et huit compagnons partent en voyage pour détruire l'Anneau Unique.",
      genre: "Fantasy",
      director: "Peter Jackson",
      releaseYear: 2001,
      imageUrl: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
      trailerUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
      stock: 3
    },
    {
      id: 11,
      title: "The Silence of the Lambs",
      description: "Une jeune agent du FBI doit faire appel à un psychopathe emprisonné pour l'aider à attraper un autre tueur en série.",
      genre: "Thriller",
      director: "Jonathan Demme",
      releaseYear: 1991,
      imageUrl: "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkloHQvxYg9Q5gZO.jpg",
      trailerUrl: "https://www.youtube.com/embed/W6Mm8Sbe__o",
      stock: 2
    },
    {
      id: 12,
      title: "The Good, the Bad and the Ugly",
      description: "Un chasseur de primes, un bandit et un tueur à gages se battent pour trouver un trésor enfoui.",
      genre: "Western",
      director: "Sergio Leone",
      releaseYear: 1966,
      imageUrl: "https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
      trailerUrl: "https://www.youtube.com/embed/WCN5JJY_wiA",
      stock: 3
    }
  ];

  static getAll() {
    return this.movies;
  }

  static getById(id) {
    return this.movies.find(movie => movie.id === id);
  }

  static search(query) {
    const searchTerm = query.toLowerCase();
    return this.movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm)
    );
  }

  static getByGenre(genre) {
    return this.movies.filter(movie => movie.genre === genre);
  }

  static getGenres() {
    return [...new Set(this.movies.map(movie => movie.genre))];
  }

  static deleteAll() {
    this.movies = [];
  }

  static async addImage(movieId, imagePath) {
    const query = `
      INSERT INTO movie_images (movie_id, image_path)
      VALUES (?, ?)
    `;
    await db.query(query, [movieId, imagePath]);
  }

  static async getImages(movieId) {
    const query = `
      SELECT id, image_path as path
      FROM movie_images
      WHERE movie_id = ?
    `;
    const [images] = await db.query(query, [movieId]);
    return images;
  }

  static async getImage(movieId, imageId) {
    const query = `
      SELECT id, image_path as path
      FROM movie_images
      WHERE movie_id = ? AND id = ?
    `;
    const [images] = await db.query(query, [movieId, imageId]);
    return images[0];
  }

  static async deleteImage(movieId, imageId) {
    const query = `
      DELETE FROM movie_images
      WHERE movie_id = ? AND id = ?
    `;
    await db.query(query, [movieId, imageId]);
  }
}

module.exports = Movie; 