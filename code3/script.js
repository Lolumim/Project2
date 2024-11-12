const API_KEY = 'f811cdbc0fb55ee39687ea9c2e075e71';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const chartCanvas = document.getElementById('chart');

// Функция для отображения текущей погоды
async function getCurrentWeather(city) {
    const response = await fetch(`${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    displayCurrentWeather(data);
}

// Функция для отображения прогноза на 5 дней
async function getWeatherForecast(city) {
    const response = await fetch(`${BASE_URL}forecast?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    displayForecast(data);
    displayChart(data);
}

// Отображение текущей погоды
function displayCurrentWeather(data) {
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Conditions: ${data.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
    `;
}

// Отображение прогноза в таблице
function displayForecast(data) {
    forecastDiv.innerHTML = `
        <table class="forecast-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Conditions</th>
                </tr>
            </thead>
            <tbody>
                ${data.list.map(item => `
                    <tr>
                        <td>${new Date(item.dt_txt).toLocaleString()}</td>
                        <td>${item.main.temp}</td>
                        <td>${item.main.humidity}</td>
                        <td><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}"> ${item.weather[0].description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Отображение графика температур
function displayChart(data) {
    const labels = data.list.map(item => new Date(item.dt_txt).toLocaleTimeString());
    const temperatures = data.list.map(item => item.main.temp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Temperature (°C)',
            data: temperatures,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true,
        }]
    };

    new Chart(chartCanvas, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

// Обработка нажатия кнопки поиска
searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getCurrentWeather(city);
        getWeatherForecast(city);
    }
});

