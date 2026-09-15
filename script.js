const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherContainer =
    document.getElementById("weatherContainer");
const cityName =
    document.getElementById("cityName");
const countryName =
    document.getElementById("countryName");
const temperature =
    document.getElementById("temperature");
const weatherDescription =
    document.getElementById("weatherDescription");
const weatherIcon =
    document.getElementById("weatherIcon");
const humidity =
    document.getElementById("humidity");
const windSpeed =
    document.getElementById("windSpeed");
const feelsLike =
    document.getElementById("feelsLike");
const cloudCover =
    document.getElementById("cloudCover");
const latitude =
    document.getElementById("latitude");
const longitude =
    document.getElementById("longitude");
const timezone =
    document.getElementById("timezone");
function getWeatherInformation(code) {
    const weatherCodes = {
        0: {
            description: "Clear Sky",
            icon: "☀️"
        },
        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },
        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },
        3: {
            description: "Overcast",
            icon: "☁️"
        },
        45: {
            description: "Fog",
            icon: "🌫️"
        },
        48: {
            description: "Depositing Rime Fog",
            icon: "🌫️"
        },
        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },
        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },
        55: {
            description: "Dense Drizzle",
            icon: "🌧️"
        },
        61: {
            description: "Slight Rain",
            icon: "🌦️"
        },
        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },
        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },
        71: {
            description: "Slight Snow",
            icon: "🌨️"
        },
        73: {
            description: "Moderate Snow",
            icon: "❄️"
        },
        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },
        80: {
            description: "Rain Showers",
            icon: "🌦️"
        },
        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },
        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },
        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },
        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },
        99: {
            description: "Severe Thunderstorm",
            icon: "⛈️"
        }
    };
    return weatherCodes[code] || {
        description: "Unknown Weather",
        icon: "🌍"
    };
}
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}
function hideError() {
    errorMessage.style.display = "none";
}
async function getCityCoordinates(city) {
    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            "Unable to connect to location service."
        );
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(
            `City "${city}" was not found. Please check the spelling.`
        );
    }
    return data.results[0];
}
async function getWeather(latitudeValue, longitudeValue) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitudeValue}&longitude=${longitudeValue}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_available,cloud_cover,wind_speed_10m,weather_code&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            "Unable to retrieve weather information."
        );
    }
    return await response.json();
}
function displayWeather(location, weatherData) {
    const current =
        weatherData.current;
    const weatherInfo =
        getWeatherInformation(
            current.weather_code
        );
    cityName.textContent =
        location.name;
    countryName.textContent =
        `${location.admin1 || ""} ${location.country || ""}`;
    temperature.textContent =
        Math.round(current.temperature_2m);
    weatherDescription.textContent =
        weatherInfo.description;
    weatherIcon.textContent =
        weatherInfo.icon;
    humidity.textContent =
        current.relative_humidity_2m;
    windSpeed.textContent =
        current.wind_speed_10m;
    feelsLike.textContent =
        Math.round(current.apparent_temperature);
    cloudCover.textContent =
        current.cloud_cover;
    latitude.textContent =
        location.latitude.toFixed(4);
    longitude.textContent =
        location.longitude.toFixed(4);
    timezone.textContent =
        location.timezone;
    weatherContainer.style.display =
        "block";
}
async function searchWeather() {
    const city =
        cityInput.value.trim();
    if (city === "") {
        showError(
            "Please enter a city name."
        );
        return;
    }
    hideError();
    loading.style.display =
        "block";
    weatherContainer.style.display =
        "none";
    try {
        const location =
            await getCityCoordinates(city);
        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );
        displayWeather(
            location,
            weatherData
        );
    }
    catch (error) {
        console.error(
            "Weather API Error:",
            error
        );
        showError(
            error.message ||
            "Something went wrong. Please try again."
        );
    }
    finally {
        loading.style.display =
            "none";
    }
}
searchBtn.addEventListener(
    "click",
    searchWeather
);
cityInput.addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Enter") {
            searchWeather();
        }
    }
);
window.addEventListener(
    "load",
    function() {
        cityInput.value =
            "Chennai";
        searchWeather();
    }
);
