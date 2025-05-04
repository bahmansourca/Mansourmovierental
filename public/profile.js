document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const userStr = localStorage.getItem('user');
    console.log('User string from localStorage:', userStr);
    
    const user = JSON.parse(userStr);
    console.log('Parsed user data:', user);
    
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Afficher les informations de l'utilisateur
    const profileInfo = document.getElementById('profileInfo');
    const userData = {
        name: user.name || 'Not available',
        email: user.email || 'Not available',
        date_inscription: user.date_inscription ? new Date(user.date_inscription).toLocaleDateString() : 'Not available'
    };
    console.log('User data to display:', userData);
    
    profileInfo.innerHTML = `
        <div class="profile-field">
            <label>Name:</label>
            <input type="text" id="name" value="${userData.name}" disabled>
        </div>
        <div class="profile-field">
            <label>Email:</label>
            <input type="email" id="email" value="${userData.email}" disabled>
        </div>
        <div class="profile-field">
            <label>Member Since:</label>
            <input type="text" value="${userData.date_inscription}" disabled>
        </div>
    `;

    // Charger les locations
    loadRentals();

    // Gérer la déconnexion
    document.getElementById('logoutBtn').addEventListener('click', async () => {
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
});

async function loadRentals() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/rentals', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erreur lors du chargement des locations');

        const rentals = await response.json();
        displayRentals(rentals);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('rentalsContainer').innerHTML = '<p class="error">Erreur lors du chargement des locations</p>';
    }
}

function displayRentals(rentals) {
    const container = document.getElementById('rentalsContainer');
    
    if (!rentals || rentals.length === 0) {
        container.innerHTML = '<p class="no-rentals">Aucune location en cours</p>';
        return;
    }

    container.innerHTML = rentals.map(rental => `
        <div class="rental-card">
            <img src="${rental.movie.imageUrl}" alt="${rental.movie.title}" class="rental-image">
            <div class="rental-info">
                <h3 class="rental-title">${rental.movie.title}</h3>
                <div class="rental-details">
                    <p>Genre: ${rental.movie.genre}</p>
                    <p>Réalisateur: ${rental.movie.director}</p>
                    <p>Date de location: ${new Date(rental.rentalDate).toLocaleDateString()}</p>
                    <p>Date de retour prévue: ${new Date(rental.returnDate).toLocaleDateString()}</p>
                </div>
                <span class="rental-status ${rental.status === 'ACTIVE' ? 'status-active' : 'status-returned'}">
                    ${rental.status === 'ACTIVE' ? 'En cours' : 'Retourné'}
                </span>
                <button 
                    class="return-button" 
                    onclick="returnMovie(${rental.id})"
                    ${rental.status === 'RETURNED' ? 'disabled' : ''}
                >
                    Retourner le film
                </button>
            </div>
        </div>
    `).join('');
}

window.returnMovie = async (rentalId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rentals/${rentalId}/return`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Film retourné avec succès !');
            loadRentals(); // Recharger la liste des locations
        } else {
            const error = await response.json();
            alert(error.message || 'Erreur lors du retour du film');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du retour du film');
    }
}; 