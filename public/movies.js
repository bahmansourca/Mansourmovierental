document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const moviesContainer = document.getElementById('moviesContainer');
    const genreFilter = document.getElementById('genreFilter');
    const trailerModal = document.getElementById('trailerModal');
    const trailerFrame = document.getElementById('trailerFrame');
    const closeTrailer = document.getElementById('closeTrailer');
    const logoutButton = document.getElementById('logoutButton');

    // Gérer la déconnexion
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            } else {
                throw new Error('Erreur lors de la déconnexion');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la déconnexion');
        }
    });

    // Charger les genres
    async function loadGenres() {
        try {
            const response = await fetch('/api/movies/genres', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const genres = await response.json();
            
            genreFilter.innerHTML = '<option value="">All genres</option>';
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des genres:', error);
        }
    }

    // Charger les films
    async function loadMovies(searchTerm = '', genre = '') {
        try {
            let url = '/api/movies';
            if (searchTerm || genre) {
                url += `?search=${encodeURIComponent(searchTerm)}&genre=${encodeURIComponent(genre)}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors du chargement des films');
            
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error('Erreur:', error);
            moviesContainer.innerHTML = '<p class="error">Erreur lors du chargement des films</p>';
        }
    }

    // Afficher les films
    function displayMovies(movies) {
        if (!movies || movies.length === 0) {
            moviesContainer.innerHTML = '<p class="no-movies">No movie found</p>';
            return;
        }

        moviesContainer.innerHTML = movies.map(movie => `
            <div class="movie-card fade-in">
                <img src="${movie.imgPath}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-details">
                        <span class="movie-genre">${movie.genre}</span> • 
                        <span class="movie-year">${movie.releaseYear}</span>
                    </div>
                    <p class="movie-director">Director: ${movie.director}</p>
                    <p class="movie-description">${movie.description}</p>
                    <div class="movie-actions">
                        <button class="button secondary-button" onclick="showTrailer('${movie.trailerUrl}')">
                            Watch Trailer
                        </button>
                        <button 
                            class="button primary-button rent-movie-btn" 
                            data-movie-id="${movie.id}"
                            ${movie.stock === 0 ? 'disabled' : ''}
                        >
                            ${movie.stock === 0 ? 'Unavailable' : 'Rent the movie'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to rent buttons
        document.querySelectorAll('.rent-movie-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const movieId = e.target.dataset.movieId;
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        window.location.href = '/login.html';
                        return;
                    }

                    const response = await fetch(`/api/rentals/rent/${movieId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert('Movie rented successfully!');
                        // Reload movies to update stock
                        loadMovies(searchInput.value.trim(), genreFilter.value);
                    } else {
                        alert(data.error || 'Failed to rent movie');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while renting the movie');
                }
            });
        });
    }

    // Gérer la recherche
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        const genre = genreFilter.value;
        loadMovies(searchTerm, genre);
    }

    // Événements
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    genreFilter.addEventListener('change', handleSearch);

    // Fonctions globales pour les boutons
    window.showTrailer = (trailerUrl) => {
        if (!trailerUrl) {
            alert('No trailer available for this movie');
            return;
        }
        const trailerFrame = document.getElementById('trailerFrame');
        const trailerModal = document.getElementById('trailerModal');
        
        // Convertir l'URL YouTube en URL d'embed si nécessaire
        let embedUrl = trailerUrl;
        if (trailerUrl.includes('youtube.com/watch')) {
            const videoId = trailerUrl.split('v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        trailerFrame.src = embedUrl;
        trailerModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page
    };

    window.closeTrailerModal = () => {
        const trailerFrame = document.getElementById('trailerFrame');
        const trailerModal = document.getElementById('trailerModal');
        trailerFrame.src = '';
        trailerModal.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le défilement de la page
    };

    // Ajouter l'événement de fermeture de la modal
    document.getElementById('closeTrailer').addEventListener('click', closeTrailerModal);

    // Initialisation
    loadGenres();
    loadMovies();
}); 