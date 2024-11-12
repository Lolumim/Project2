const API_KEY = 'f5e076c09c7943d0b54f9706920748bc';
const BASE_URL = 'https://api.spoonacular.com/recipes';

const searchInput = document.getElementById('search-input');
const recipeList = document.getElementById('recipe-list');
const recipeModal = document.getElementById('recipe-modal');

// Функция поиска рецептов
async function searchRecipes(query) {
    const response = await fetch(`${BASE_URL}/complexSearch?query=${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    displayRecipes(data.results);
}

// Отображение списка рецептов
function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>Ready in ${recipe.readyInMinutes} minutes</p>
        `;
        recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
        recipeList.appendChild(recipeCard);
    });
}

// Функция для отображения деталей рецепта
async function showRecipeDetails(id) {
    const response = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
    const recipe = await response.json();

    recipeModal.classList.remove('hidden');
    recipeModal.innerHTML = `
        <div class="modal-content">
            <h2>${recipe.title}</h2>
            <p>${recipe.instructions}</p>
            <button onclick="saveToFavorites(${recipe.id})">Add to Favorites</button>
            <button onclick="closeModal()">Close</button>
        </div>
    `;
}

// Функция для добавления в избранное
function saveToFavorites(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Recipe added to favorites!');
    } else {
        alert('Recipe already in favorites');
    }
}

// Функция для закрытия модального окна
function closeModal() {
    recipeModal.classList.add('hidden');
}

// Слушатель для ввода текста в строку поиска
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query) {
        searchRecipes(query);
    } else {
        recipeList.innerHTML = '';
    }
});

const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchRecipes(query);
    } else {
        recipeList.innerHTML = '';
    }
});