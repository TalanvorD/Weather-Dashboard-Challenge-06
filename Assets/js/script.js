const apiKey = "39682e30478cbf87be86ab74ba8d26d7"; // OpenWeather API Key
const firstDayContainer = document.querySelector('#first-day-container'); // Selectors for DOM traversal
const fiveDayContainer = document.querySelector('#five-day-container');
const fiveDayForecastHeader = document.querySelector('#five-day-forecast-header');

let lat = "";
let lon = "";
let fiveDayForecastData = [];
let storedCities = [];

function renderForecast (){
    const firstDayForecast = document.createElement("article"); // Creates an article to hold the current forecast entry
    firstDayForecast.setAttribute("class", "col"); // Sets the class of the article for CSS manipulation
    const cityTitle = document.createElement('h1'); // Creates a header for the city, date and icon
    let weatherIcon = document.createElement('img');
    weatherIcon.src = fiveDayForecastData.day[0].icon;
    let tempInfo = document.createElement('p');
    let windInfo = document.createElement('p');
    let humidityInfo = document.createElement('p');
    cityTitle.textContent = `Current conditions in ${fiveDayForecastData.city} ${fiveDayForecastData.day[0].date}`;
    tempInfo.textContent = `Average Temperature: ${fiveDayForecastData.day[0].temp}`;
    windInfo.textContent = `Wind: ${fiveDayForecastData.day[0].wind}`;
    humidityInfo.textContent = `Humidity: ${fiveDayForecastData.day[0].humidity}`;
    firstDayForecast.appendChild(cityTitle); // Appends the header, icon, temperature, wind speed and humidity info  to the article
    firstDayForecast.appendChild(weatherIcon);
    firstDayForecast.appendChild(tempInfo);
    firstDayForecast.appendChild(windInfo);
    firstDayForecast.appendChild(humidityInfo);
    firstDayContainer.appendChild(firstDayForecast); // Appends the article to the page

    fiveDayForecastHeader.setAttribute("class", "visible");

    for (let i = 1; i < fiveDayForecastData.day.length; i++){
        let fiveDayForecast = document.createElement("article"); // Creates an article to hold each entry for the five day forecast
        fiveDayForecast.setAttribute("class", "col"); // Sets the class of the article for CSS manipulation
        dateTitle = document.createElement('h1'); // Creates a header for the date and icon
        weatherIcon = document.createElement('img');
        weatherIcon.src = fiveDayForecastData.day[i].icon;
        tempInfo = document.createElement('p');
        windInfo = document.createElement('p');
        humidityInfo = document.createElement('p');
        dateTitle.textContent = `${fiveDayForecastData.day[i].date}`;
        tempInfo.textContent = `Average Temperature: ${fiveDayForecastData.day[i].temp}`;
        windInfo.textContent = `Wind: ${fiveDayForecastData.day[i].wind}`;
        humidityInfo.textContent = `Humidity: ${fiveDayForecastData.day[i].humidity}`;
        fiveDayForecast.appendChild(dateTitle); // Appends the header, icon, temperature, wind speed and humidity info  to the article
        fiveDayForecast.appendChild(weatherIcon);
        fiveDayForecast.appendChild(tempInfo);
        fiveDayForecast.appendChild(windInfo);
        fiveDayForecast.appendChild(humidityInfo);
        fiveDayContainer.appendChild(fiveDayForecast); // Appends the article to the page
    };
};

function getForecastLocation (city) { // Call the OpenWeather Geocoding API to get latitude and longitude coordinates for a city
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`, { cache: "reload" })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        getWeatherForecast();
    });
return;
};

function getWeatherForecast() { // Calls the OpenWeather API to get the forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&APPID=${apiKey}`, { cache: "reload" })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const forecastResponse = { // Stores the city name, latitude and longitude in the object
                city: data.city.name,
                lat: data.city.coord.lat,
                lon: data.city.coord.lon,
                day: []
            }

            let = cityToStore = {
                city: data.city.name,
                lat: data.city.coord.lat,
                lon: data.city.coord.lon,
            };

            localStorage.setItem('storedCities', JSON.stringify(cityToStore)); // Stores the object containing the 5 day forecast data for this city
            
            for (let i = 0; i < data.list.length; i+=7){ // Loops through the json response to gather data. Need to skip through to every 7th entry to get the 6 day forecast
                let dateToParse = new Date(data.list[i].dt * 1000);
                let parsedDate = dateToParse.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'});
                let dayObjectToPush = {
                    date: parsedDate,
                    temp: data.list[i].main.temp,
                    wind: data.list[i].wind.speed,
                    humidity: data.list[i].main.humidity,
                    icon: "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png"
                }
                forecastResponse.day.push(dayObjectToPush);
            };

            //saveTasksToStorage(taskEntries); // Calls the function that stringifies and saves the task list into local storage
            
        fiveDayForecastData = forecastResponse; // Stores the parsed response to a global variable

        renderForecast(); // Calls the function to render the forecast results to the page
        });
    return;
};

// if (!response.ok) {console.log(errorMsg)); error checking for bad responses, probably need this for non-existant city entries