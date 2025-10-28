
const cities = ["Shanghai", "Boston", "Lucknow", "Kolkata", "Mumbai", "Delhi"];
const tableBody = document.getElementById("tableBody");

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const locationDiv = document.getElementById("location");
const resultDiv = document.getElementById("result");
const wMain = document.getElementById("w_main");
const temp = document.getElementById("temp");
const tFeel = document.getElementById("t_feel");
const tMin = document.getElementById("t_min");
const tMax = document.getElementById("t_max");
const humidity = document.getElementById("humidity");
const hum = document.getElementById("hum");
const pressure = document.getElementById("pressure");
const sLvl = document.getElementById("s_lvl");
const gLvl = document.getElementById("g_lvl");
const wSpeed = document.getElementById("w_speed");
const wSp = document.getElementById("w_sp");
const wDir = document.getElementById("w_dir");
const sr = document.getElementById("sr");
const ss = document.getElementById("ss");

const iconMap = {
  Clear: '<i class="fa-solid fa-sun text-warning"></i>',                // ☀️
  Clouds: '<i class="fa-solid fa-cloud text-secondary"></i>',           // ☁️
  Rain: '<i class="fa-solid fa-cloud-showers-heavy text-primary"></i>', // 🌧️
  Drizzle: '<i class="fa-solid fa-cloud-rain text-info"></i>',          // 🌦️
  Thunderstorm: '<i class="fa-solid fa-bolt text-warning"></i>',        // ⚡
  Snow: '<i class="fa-regular fa-snowflake text-light"></i>',           // ❄️
  Mist: '<i class="fa-solid fa-smog text-muted"></i>',                  // 🌫️
  Smoke: '<i class="fa-solid fa-smog text-muted"></i>',                 // 💨
  Haze: '<i class="fa-solid fa-smog text-muted"></i>',                  // 🌁
  Fog: '<i class="fa-solid fa-smog text-muted"></i>',                   // 🌫️
  Dust: '<i class="fa-solid fa-cloud text-secondary"></i>',             // 🌪️
  Sand: '<i class="fa-solid fa-cloud text-secondary"></i>',             // 🌬️
  Ash: '<i class="fa-solid fa-cloud text-secondary"></i>',              // 🌋
  Squall: '<i class="fa-solid fa-wind text-info"></i>',                 // 💨
  Tornado: '<i class="fa-solid fa-tornado text-dark"></i>',             // 🌪️
};


// Fill weather table for predefined cities

async function fillWeatherTable() {
	for (let i = 0; i < cities.length; i++) {
		const city = cities[i];
		const data = await getWeather(city);
		if (data.cod === 200) {
			const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
			const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
			const tr = document.createElement("tr");
			tr.innerHTML = `
        <td>${city}</td>
        <td>${data.weather[0].description}</td>
        <td>${data.main.temp}°C</td>
        <td>${data.main.feels_like}°C</td>
        <td>${data.main.temp_min}°C</td>
        <td>${data.main.temp_max}°C</td>
        <td>${data.main.pressure}</td>
        <td>${data.main.humidity}%</td>
        <td>${data.main.sea_level || '-'}</td>
        <td>${data.main.grnd_level || '-'}</td>
        <td>${data.wind.speed} m/s</td>
        <td>${data.wind.deg}°</td>
        <td>${sunrise}</td>
        <td>${sunset}</td>
      `;
			tableBody.replaceChild(tr, tableBody.children[i]);
		} else {
			console.error("City not found:", city);
		}
	}
}

fillWeatherTable();

// 1️⃣ On load, get user location
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherByLocation, showError);
  } else {
    resultDiv.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
  }
});

// 2️⃣ If user clicks Search manually
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name!");

  fetchWeatherByCity(city);
});

// --- PROXY HELPER ---
async function callWeatherAPI(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/weather?${query}`);
  return await res.json();
}

// --- UPDATED: getWeather (for city) ---
async function getWeather(city) {
  return await callWeatherAPI({ city });
}

// --- UPDATED: showWeatherByLocation ---
function showWeatherByLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  callWeatherAPI({ lat, lon })
    .then(data => showWeatherCard(data))
    .catch(() => {
      resultDiv.innerHTML = `<p style="color:red;">Error fetching location weather!</p>`;
    });
}

// --- UPDATED: fetchWeatherByCity ---
function fetchWeatherByCity(city) {
  callWeatherAPI({ city })
    .then(data => showWeatherCard(data))
    .catch(() => {
      resultDiv.innerHTML = `<p style="color:red;">Error fetching weather!</p>`;
    });
}

function showWeatherCard(data) {
  if (data.cod !== 200) {
    alert(data.message);
    return;
  }

  // Weather icon
  const weatherMain = data.weather[0].main;
  const weatherIcon = iconMap[weatherMain] || '<i class="fa-solid fa-sun text-warning"></i>'; // fallback

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

  locationDiv.textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector("#w_icon").innerHTML = `${weatherIcon}`;
  wMain.textContent = `${data.weather[0].main}(${data.weather[0].description})`;
  temp.textContent = `Temp: ${data.main.temp} °C`;
  tFeel.textContent = `Feels Like: ${data.main.feels_like} °C`;
  tMin.textContent = `Temp Min: ${data.main.temp_min} °C`;
  tMax.textContent = `Temp Max: ${data.main.temp_max} °C`;
  humidity.textContent = `${data.main.humidity}%`;
  hum.textContent = `Humidity: ${data.main.humidity}%`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  sLvl.textContent = `Sea Level: ${data.main.sea_level ? data.main.sea_level + ' hPa' : 'N/A'}`;
  gLvl.textContent = `Ground Level: ${data.main.grnd_level ? data.main.grnd_level + ' hPa' : 'N/A'}`;
  wSpeed.textContent = `${data.wind.speed} m/s`;
  wSp.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  wDir.textContent = `Wind Direction: ${data.wind.deg}°`;
  sr.textContent = `Sunrise: ${sunrise}`;
  ss.textContent = `Sunset: ${sunset}`;

}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      resultDiv.innerHTML = "<p>User denied location access.</p>";
      break;
    case error.POSITION_UNAVAILABLE:
      resultDiv.innerHTML = "<p>Location information is unavailable.</p>";
      break;
    case error.TIMEOUT:
      resultDiv.innerHTML = "<p>Location request timed out.</p>";
      break;
    default:
      resultDiv.innerHTML = "<p>An unknown error occurred.</p>";
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
