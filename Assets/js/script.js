const apiKey = "39682e30478cbf87be86ab74ba8d26d7"; // OpenWeather API Key
//let city = "";
let lat = "";
let lon = "";
let fiveDayforecastData = [];

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
            const forecastResponse = { // Creates the forecast data object from the JSON response. Need data.list 0, 8, 
                city: data.city.name,
                lat: data.city.coord.lat,
                lon: data.city.coord.lon,
                day: []
            }
            
            for (let i = 0; i < data.list.length; i+=7){
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

            //taskEntries.push(taskEntry); // Pushes the task entry to the task list array
            //saveTasksToStorage(taskEntries); // Calls the function that stringifies and saves the task list into local storage
            
            //localStorage.setItem('storedForecasts', forecastResponse); // Stores the object containing the 5 day forecast data for this city
        console.log(forecastResponse);
        });
    return;
};