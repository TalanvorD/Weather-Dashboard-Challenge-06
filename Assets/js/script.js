const apiKey = "39682e30478cbf87be86ab74ba8d26d7"; // OpenWeather API Key
const firstDayContainer = document.querySelector('#first-day-container'); // Selectors for DOM traversal
const fiveDayContainer = document.querySelector('#five-day-container');
const fiveDayForecastHeader = document.querySelector('#five-day-forecast-header');
const citySearchForm = document.querySelector('#city-search-form');
const cityInput = document.querySelector('#city-input');
const cityRecallForm = document.querySelector('#city-recall-form');
const pastCitiesContainer = document.querySelector('#past-cities');

let city = ""; // Global variables
let lat = "";
let lon = "";
let fiveDayForecastData = [];
let storedCities = [];

function init() {
    const storedCityEntries = JSON.parse(localStorage.getItem('storedCities')); // Checks for a stored array in local storage and if so sets it to the working array
    if (storedCityEntries !== null) {
        storedCities = storedCityEntries;
    } else { return; }
    generatePastButtons();
  };

function storeCityData(){ // Stores the city data to localStorage in a stringified array
    storedCities.push(city);
    let dupeCitiesRemoved = storedCities.filter((value, index, array) => array.indexOf(value) === index); // Removes duplicate entries so buttons don't get repeated
    dupeCitiesRemoved.sort();// Sorting the array
    storedCities = dupeCitiesRemoved;
    localStorage.setItem('storedCities', JSON.stringify(storedCities)); // Stores the array containing the previously searched cities
    generatePastButtons();
};

function generatePastButtons(){ // Builds the buttons under the search bar from that array
    pastCitiesContainer.textContent = ""; // Clears any previously rendered buttons from the container
    for (let i = 0; i < storedCities.length; i++){
        let buildCityButton = document.createElement("button"); // Creates a button for each stored city
        buildCityButton.setAttribute("class", "btn btn-success"); // Sets the class of the article for CSS manipulation
        buildCityButton.setAttribute("type", "submit"); // Sets the type of the button
        buildCityButton.textContent = storedCities[i]; // Uses the entries in the storedCities array for the text
        pastCitiesContainer.appendChild(buildCityButton); // Appends the button to the page
    }
}

function renderForecast (){
    firstDayContainer.textContent = ""; // Rendering the current conditions outside of the loop because it has a different target
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

    fiveDayForecastHeader.setAttribute("class", "visible"); // Makes the five day forecast header visible
    fiveDayContainer.textContent = ""; // Clears the five day forecast container prior to rendering

    for (let i = 1; i < fiveDayForecastData.day.length; i++){ // Loops through the array to create elements and render to the page
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

function getForecastLocation (input) { // Call the OpenWeather Geocoding API to get latitude and longitude coordinates for a city
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${apiKey}`, { cache: "reload" })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data == ""){ // Error checking the API response. It always returns okay even if the response is empty.
            alert("The API didn't like that submission! Please check the spelling of that city.")
        } else {
        lat = data[0].lat;
        lon = data[0].lon;
        getWeatherForecast(); // Calls the forecast API with the acquired lat/lon coordinates
        }
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

            city = data.city.name; // Setting the resolved global city variable here because the response from the forecast api is different from the geo api

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
                forecastResponse.day.push(dayObjectToPush); // Pushes the newly created forecast object to the working array
            };
            
        fiveDayForecastData = forecastResponse; // Stores the parsed response to a global variable
        renderForecast(); // Calls the function to render the forecast results to the page
        storeCityData(); // Calls the function to store the city data after rendering
        });
    return;
};

citySearchForm.addEventListener('submit', function (event) { // Listens for a submit event from the search form
    event.preventDefault(); // Stops the page from refreshing on submit
    if (cityInput.value === ""){ // Checks for an empty field submission
      alert("Please fill in all fields before continuing.");
      return;
    } else {  
        getForecastLocation(cityInput.value); // Calls the function to resolve the lat/lon of the city
        cityInput.value = ""; // Clears the input field
    };
});

cityRecallForm.addEventListener('click', function (event) { // Listens for a click event on a button
    event.preventDefault(); // Stops the page from refreshing on submit
    getForecastLocation(event.target.firstChild.data); // Calls the function to resolve the lat/lon of the city from the button click
});

init(); // Function to call on load, checks localStorage and renders buttons under the search form