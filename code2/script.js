const API_KEY = 'bd87cf62ad8605271c65b1fd49c2237d';
const BASE_URL = 'https://api.themoviedb.org/3';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const favoritesButton = document.getElementById('favorites-button');
const movieList = document.getElementById('movie-list');
const movieModal = document.getElementById('movie-modal');
const genreSelect = document.getElementById('genre-select');

// Загрузка жанров
async function loadGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Поиск фильмов
async function searchMovies(query, genreId = null) {
    let url = `${BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`;
    if (genreId) url += `&with_genres=${genreId}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Отображение фильмов
function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button onclick="addToFavorites(${movie.id})">Add to Favorites</button>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieList.appendChild(movieCard);
    });
}

// Отображение деталей фильма
async function showMovieDetails(id) {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const movie = await response.json();

    movieModal.classList.remove('hidden');
    movieModal.innerHTML = `
        <div class="modal-content">
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            <button onclick="closeModal()">Close</button>
        </div>
    `;
}

// Добавление в избранное
function addToFavorites(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Movie added to favorites!');
    } else {
        alert('Movie already in favorites');
    }
}

// Показ избранного
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    movieList.innerHTML = '';
    favorites.forEach(id => showMovieDetails(id));
}

function closeModal() {
    movieModal.classList.add('hidden');
}

// События
searchButton.addEventListener('click', () => searchMovies(searchInput.value));
favoritesButton.addEventListener('click', showFavorites);
genreSelect.addEventListener('change', (e) => searchMovies(searchInput.value, e.target.value));

loadGenres();

