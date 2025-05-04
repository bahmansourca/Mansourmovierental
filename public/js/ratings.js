// Function to display rating stars
function createRatingStars(movieId) {
    const ratingSection = document.querySelector('.rating-section');
    if (!ratingSection) return;

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = '★';
        star.dataset.rating = i;
        
        star.addEventListener('click', () => {
            const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
            if (!ratings[movieId]) {
                ratings[movieId] = [];
            }
            ratings[movieId].push(i);
            localStorage.setItem('ratings', JSON.stringify(ratings));
            
            // Update stars display
            const stars = document.querySelectorAll('.star');
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < i);
            });
            
            // Update average rating
            updateAverageRating(movieId);

            // Display thank you message
            const thankYouMessage = document.createElement('div');
            thankYouMessage.className = 'thank-you-message';
            thankYouMessage.textContent = 'Thank you!';
            thankYouMessage.style.color = '#10b981';
            thankYouMessage.style.marginTop = '10px';
            thankYouMessage.style.fontWeight = '600';
            thankYouMessage.style.animation = 'fadeIn 0.5s ease-in-out';
            
            // Remove old message if it exists
            const oldMessage = document.querySelector('.thank-you-message');
            if (oldMessage) {
                oldMessage.remove();
            }
            
            ratingSection.appendChild(thankYouMessage);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                thankYouMessage.style.animation = 'fadeOut 0.5s ease-in-out';
                setTimeout(() => {
                    thankYouMessage.remove();
                }, 500);
            }, 3000);
        });
        
        starsContainer.appendChild(star);
    }
    
    ratingSection.appendChild(starsContainer);
    
    // Create average rating display
    const averageRating = document.createElement('div');
    averageRating.className = 'average-rating';
    ratingSection.appendChild(averageRating);
    
    // Initialize average rating
    updateAverageRating(movieId);
}

// Function to update average rating
function updateAverageRating(movieId) {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    const movieRatings = ratings[movieId] || [];
    
    if (movieRatings.length === 0) {
        document.querySelector('.average-rating').textContent = 'Average rating: 0/5';
        return;
    }
    
    const sum = movieRatings.reduce((a, b) => a + b, 0);
    const average = (sum / movieRatings.length).toFixed(1);
    document.querySelector('.average-rating').textContent = `Average rating: ${average}/5`;
}

// Add styles for rating stars
const style = document.createElement('style');
style.textContent = `
    .rating-stars {
        display: flex;
        gap: 5px;
        margin: 10px 0;
    }
    
    .star {
        color: #ccc;
        cursor: pointer;
        font-size: 24px;
        transition: color 0.3s;
    }
    
    .star.active {
        color: #ffd700;
    }
    
    .average-rating {
        color: #ccc;
        font-size: 14px;
        margin-top: 5px;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Load user ratings when page loads
document.addEventListener('DOMContentLoaded', loadUserRatings);

// Function to load user ratings
async function loadUserRatings() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/ratings/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const ratings = await response.json();
        
        // Mettre à jour les étoiles pour chaque film noté
        ratings.forEach(rating => {
            const stars = document.querySelectorAll(`.star-rating[data-movie-id="${rating.movie_id}"] .star`);
            if (stars) {
                stars.forEach((star, index) => {
                    if (index < rating.rating) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
    }
} 