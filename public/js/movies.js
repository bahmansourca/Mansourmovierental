// Fonction pour afficher les films
async function displayMovies(movies) {
    const moviesGrid = document.querySelector('.movies-grid');
    moviesGrid.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.dataset.movieId = movie.id;

        // Formater les genres en badges
        const genres = movie.genre ? movie.genre.split(',').map(genre => genre.trim()) : ['Non specified'];
        const genreBadges = genres.map(genre => `<span class="genre-badge">${genre}</span>`).join('');

        // Formater l'année de sortie
        const year = movie.annee_sortie ? `<div class="year-badge">
            <i class="fas fa-calendar"></i>
            ${movie.annee_sortie}
        </div>` : '';

        // Créer les boutons
        const buttons = `
            <div class="movie-actions">
                <button class="button primary-button view-details-button" data-movie-id="${movie.id}">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
                <button class="button primary-button rent-button" data-movie-id="${movie.id}">
                    <i class="fas fa-shopping-cart"></i> Rent
                </button>
                ${movie.trailer ? `
                    <button class="button secondary-button trailer-button" data-trailer="${movie.trailer}">
                        <i class="fas fa-play"></i> Trailer
                    </button>
                ` : ''}
            </div>
        `;

        movieCard.innerHTML = `
            <div class="movie-image-container">
                <img src="${movie.imgPath || 'images/default-movie.jpg'}" alt="${movie.title}" class="movie-image">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <div class="genres-container">
                        ${genreBadges}
                    </div>
                    ${year}
                </div>
                ${buttons}
            </div>
        `;

        moviesGrid.appendChild(movieCard);
    });

    // Ajouter les gestionnaires d'événements pour les boutons
    addEventListeners();
}

// Fonction pour ajouter les gestionnaires d'événements
function addEventListeners() {
    // Gestionnaire pour le bouton View Details
    document.querySelectorAll('.view-details-button').forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.dataset.movieId;
            window.location.href = `movie-details.html?id=${movieId}`;
        });
    });

    // Gestionnaire pour le bouton de location
    document.querySelectorAll('.rent-button').forEach(button => {
        button.addEventListener('click', async () => {
            const movieId = button.dataset.movieId;
            await rentMovie(movieId);
        });
    });

    // Gestionnaire pour le bouton de bande-annonce
    document.querySelectorAll('.trailer-button').forEach(button => {
        button.addEventListener('click', () => {
            const trailerUrl = button.dataset.trailer;
            console.log('Trailer URL:', trailerUrl); // Debug log
            showTrailer(trailerUrl);
        });
    });
}

// Fonction pour louer un film
async function rentMovie(movieId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Vérifier si l'utilisateur est connecté
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            console.error('User not found in localStorage');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/rentals/rent', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filmId: movieId })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Movie rented successfully!');
            window.location.href = 'my-movies.html';
        } else {
            console.error('Rental error:', data.error);
            alert(data.error || 'Failed to rent movie');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while renting the movie');
    }
}

// Fonction pour afficher la bande-annonce
function showTrailer(trailerUrl) {
    console.log('Original trailer URL:', trailerUrl); // Debug log
    
    // Extraire l'ID de la vidéo YouTube de différentes façons
    let videoId = '';
    
    // Format standard: https://www.youtube.com/watch?v=VIDEO_ID
    if (trailerUrl.includes('watch?v=')) {
        videoId = trailerUrl.split('watch?v=')[1]?.split('&')[0];
    }
    // Format court: https://youtu.be/VIDEO_ID
    else if (trailerUrl.includes('youtu.be/')) {
        videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
    }
    // Format embed: https://www.youtube.com/embed/VIDEO_ID
    else if (trailerUrl.includes('embed/')) {
        videoId = trailerUrl.split('embed/')[1]?.split('?')[0];
    }
    // Si l'URL est déjà un ID
    else if (!trailerUrl.includes('http')) {
        videoId = trailerUrl;
    }

    console.log('Extracted video ID:', videoId); // Debug log

    if (!videoId) {
        console.error('URL de vidéo YouTube invalide:', trailerUrl);
        return;
    }

    // Créer l'URL embed avec tous les paramètres pour masquer l'interface
    const modifiedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&color=white&theme=dark&playsinline=1&origin=${window.location.origin}`;
    
    console.log('Modified embed URL:', modifiedUrl); // Debug log
    
    const modal = document.createElement('div');
    modal.className = 'trailer-modal active';
    modal.innerHTML = `
        <div class="trailer-content">
            <button class="close-trailer">&times;</button>
            <iframe 
                class="trailer-iframe" 
                src="${modifiedUrl}" 
                allowfullscreen
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
    `;

    document.body.appendChild(modal);

    // Gestionnaire pour fermer la modal
    modal.querySelector('.close-trailer').addEventListener('click', () => {
        modal.remove();
    });

    // Fermer la modal en appuyant sur Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
}

// Vérifier si l'utilisateur est connecté
function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
}

// Fonction pour mettre à jour la note moyenne
async function updateAverageRating(movieId) {
    try {
        const response = await fetch(`/api/movies/${movieId}/rate/average`);
        const data = await response.json();
        const averageRatingElement = document.querySelector(`.average-rating[data-movie-id="${movieId}"]`);
        if (averageRatingElement) {
            averageRatingElement.innerHTML = `
                <span class="rating-value">${data.averageRating.toFixed(1)}</span>
                <span class="rating-count">(${data.ratingCount} votes)</span>
            `;
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la note moyenne:', error);
    }
}

// Charger les films au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
        alert('Erreur lors du chargement des films');
    }
});