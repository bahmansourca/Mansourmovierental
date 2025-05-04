// Global variables
let currentUser = null;
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const filmsList = document.getElementById('films-list');
const myRentals = document.getElementById('my-rentals');
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const userName = document.getElementById('user-name');
const searchInput = document.getElementById('search-input');
const filmsContainer = document.getElementById('films-container');
const rentalsContainer = document.getElementById('rentals-container');
const filmModal = new bootstrap.Modal(document.getElementById('filmModal'));

// Event Listeners
document.getElementById('login-btn').addEventListener('click', () => {
    loginForm.classList.remove('d-none');
    registerForm.classList.add('d-none');
    filmsList.classList.add('d-none');
    myRentals.classList.add('d-none');
});

document.getElementById('register-btn').addEventListener('click', () => {
    registerForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
    filmsList.classList.add('d-none');
    myRentals.classList.add('d-none');
});

document.getElementById('films-link').addEventListener('click', () => {
    if (currentUser) {
        loadFilms();
        filmsList.classList.remove('d-none');
        myRentals.classList.add('d-none');
    }
});

document.getElementById('my-rentals-link').addEventListener('click', () => {
    if (currentUser) {
        loadMyRentals();
        myRentals.classList.remove('d-none');
        filmsList.classList.add('d-none');
    }
});

document.getElementById('logout-btn').addEventListener('click', logout);

document.getElementById('search-btn').addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchFilms(query);
    }
});

// Forms
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await login(email, password);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    await register(name, email, password);
});

// API Functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            updateUI();
            loadFilms();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            document.getElementById('login-btn').click();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

async function loadFilms() {
    try {
        const response = await fetch(`${API_BASE_URL}/films`);
        const films = await response.json();
        displayFilms(films);
    } catch (error) {
        console.error('Error loading films:', error);
    }
}

async function searchFilms(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/films/search/${query}`);
        const films = await response.json();
        displayFilms(films);
    } catch (error) {
        console.error('Error searching films:', error);
    }
}

async function loadMyRentals() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/rentals/my-rentals`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const rentals = await response.json();
        displayRentals(rentals);
    } catch (error) {
        console.error('Error loading rentals:', error);
    }
}

async function rentFilm(filmId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/rentals/rent/${filmId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Film rented successfully!');
            loadMyRentals();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error renting film:', error);
        alert('An error occurred while renting the film');
    }
}

async function returnFilm(rentalId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/rentals/return/${rentalId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Film returned successfully!');
            loadMyRentals();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error returning film:', error);
        alert('An error occurred while returning the film');
    }
}

// UI Functions
function updateUI() {
    if (currentUser) {
        authButtons.classList.add('d-none');
        userMenu.classList.remove('d-none');
        userName.textContent = currentUser.name;
        loginForm.classList.add('d-none');
        registerForm.classList.add('d-none');
        filmsList.classList.remove('d-none');
    } else {
        authButtons.classList.remove('d-none');
        userMenu.classList.add('d-none');
        filmsList.classList.add('d-none');
        myRentals.classList.add('d-none');
    }
}

function displayFilms(films) {
    filmsContainer.innerHTML = '';
    films.forEach(film => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-sm-6';
        card.innerHTML = `
            <div class="card film-card">
                <img src="${film.imgPath}" class="card-img-top" alt="${film.title}">
                <div class="card-body">
                    <h5 class="card-title">${film.title}</h5>
                    <p class="card-text">${film.genre}</p>
                    <button class="btn btn-primary" onclick="showFilmDetails(${film.id})">View Details</button>
                </div>
            </div>
        `;
        filmsContainer.appendChild(card);
    });
}

function displayRentals(rentals) {
    rentalsContainer.innerHTML = '';
    rentals.forEach(rental => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-sm-6';
        card.innerHTML = `
            <div class="card rental-card">
                <img src="${rental.imgPath}" class="card-img-top" alt="${rental.title}">
                <div class="card-body">
                    <h5 class="card-title">${rental.title}</h5>
                    <p class="card-text">Rented on: ${new Date(rental.rental_date).toLocaleDateString()}</p>
                    <button class="btn btn-danger" onclick="returnFilm(${rental.id})">Return Film</button>
                </div>
            </div>
        `;
        rentalsContainer.appendChild(card);
    });
}

function showFilmDetails(filmId) {
    fetch(`${API_BASE_URL}/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            document.getElementById('filmModalTitle').textContent = film.title;
            document.getElementById('filmModalImage').src = film.imgPath;
            document.getElementById('filmModalYear').textContent = film.annee_sortie;
            document.getElementById('filmModalGenre').textContent = film.genre;
            document.getElementById('filmModalLanguage').textContent = film.langue_originale;
            document.getElementById('filmModalCountry').textContent = film.pays_productions;
            document.getElementById('filmModalDirector').textContent = film.realisateurs;
            document.getElementById('filmModalActors').textContent = film.acteurs;
            document.getElementById('filmModalTrailer').src = film.trailer;
            
            const rentButton = document.getElementById('rentFilmBtn');
            rentButton.onclick = () => {
                rentFilm(film.id);
                filmModal.hide();
            };
            
            filmModal.show();
        })
        .catch(error => {
            console.error('Error loading film details:', error);
            alert('An error occurred while loading film details');
        });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    updateUI();
}

// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
    // Verify token and get user info
    fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            currentUser = data.user;
            updateUI();
            loadFilms();
        }
    })
    .catch(error => {
        console.error('Token verification error:', error);
        localStorage.removeItem('token');
    });
} 