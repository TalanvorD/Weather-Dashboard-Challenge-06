# 06 Server-Side APIs: Weather Dashboard

## Your Task

Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [5 Day Weather Forecast](https://openweathermap.org/forecast5) to retrieve weather data for cities. The base URL should look like the following: `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`. After registering for a new API key, you may need to wait up to 2 hours for that API key to activate.

**Hint**: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

You will use `localStorage` to store any persistent data. For more information on how to work with the OpenWeather API, refer to the [Full-Stack Blog on how to use API keys](https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys).

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Initial Notes

We'll need to build the entire layout with a form for user input and containers for the forecast results.
There will also need to be buttons for the user to recall previously searched cities, which will need to be stored in localStorage.
We'll need to reference the Openweather API and also the Geolocating API to get the coordinates to pass to the Openweather API, so that's two difference fetch calls.
We'll need to use several loops to go through the API response to parse the data for the information we need into arrays of objects, create the elements and then render those elements to the page.

## Steps Taken

- HTML and CSS created.
    - Initially used Bulma for the CSS framework but switched to Bootstrap.
    - Created form to take the city to be searched for and another form to display the buttons for previously searched cities.
    - Created the containers for the current weather forecast and the 5 day forecast.

- JavaScript logic.
    - Accepts the form input and sends a fetch request to the Geolocation API.
    - Used the response from that API to make a fetch request to the Openweather API.
    - Processed the response from that API to create an array of objects containing the data for the weather forecast.
    - Stores the city name into localStorage to be used to build the previously searched buttons.
        - Also filters the array for duplicate entries and sorting it into alphabetical order.
    - Iterates through the processed array of objects to build the HTML and CSS elements and then append them to their containers (current (first) and then 5 day forecast).
    - Recalls the previously searched city names from localStorage to create and append buttons representing the search history.
 
Weather Dashboard Screenshot:
![Weather Dashboard Screenshot](https://github.com/TalanvorD/Weather-Dashboard-Challenge-06/assets/164896317/0ab48356-4526-41c3-aa83-ab1d3731d78a)

Repository link: https://github.com/TalanvorD/Weather-Dashboard-Challenge-06
Live deployed link: 
