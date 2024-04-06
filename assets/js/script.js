// Global variable for API key
const APIKey = "0e403c7f945546de859fa36fbec3dec4";

// Reference to the current weather title element
const currentWeatherTitle = document.getElementById('currentTitle');

// Function to fetch current weather data for a given city
function getCurrentWeather(city) {
  // Construct the API URL for current weather data
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

  // Fetch data from the API
  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(function (data) {
      // Update the current weather title
      const title = `${data.name} (${dayjs().format('M/D/YYYY')})`;
      currentWeatherTitle.textContent = title;

      // Update other weather details
      $('#currentIcon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
      $('#temp').text(`Temp: ${data.main.temp} °F`);
      $('#wind').text(`Wind: ${data.wind.speed} MPH`);
      $('#humidity').text(`Humidity: ${data.main.humidity} %`);

      // Fetch and display forecast data
      getForecast(data.coord.lat, data.coord.lon);

      // Update search history
      updateSearchHistory(data.name);
    })
    .catch(function (error) {
      // Handle errors
      alert('Invalid city name.');
    });
}
// Function to fetch forecast data for a given latitude and longitude
function getForecast(lat, lon) {
  // Construct the API URL for forecast data
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${APIKey}&units=imperial`;

  // Clear previous forecast data
  $('#forecast').empty();

  // Fetch data from the API
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Process forecast data and display it
      let i = 0;
      for (const day of data.list) {
        i++;
        const card = $('<div>').addClass('card bg-info col-2.5 mx-auto p-2 text-white');
        const date = $('<h4>').text(dayjs().add(i, 'day').format('M/D/YYYY'));
        const icon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`);
        const temp = $('<p>').text(`Temp: ${day.main.temp} °F`);
        const wind = $('<p>').text(`Wind: ${day.wind.speed} MPH`);
        const humidity = $('<p>').text(`Humidity: ${day.main.humidity} %`);
        icon.attr('height', '30px').attr('width', '30px');
        card.append(date, icon, temp, wind, humidity);
        $('#forecast').append(card);
      }
    });
}

// Function to handle search action
function search() {
  // Get the city input value
  const city = $('#cityInput').val();

  // Fetch current weather data for the entered city
  getCurrentWeather(city);

  // Clear the city input field
  $('#cityInput').val('');
}

// Function to update search history
function updateSearchHistory(city) {
  // Retrieve search history from local storage
  let cities = JSON.parse(localStorage.getItem('cities')) || [];

  // Add the current city to the search history if it's not already present
  if (!cities.includes(city)) {
    cities.push(city);
  }

  // Update search history in local storage
  localStorage.setItem('cities', JSON.stringify(cities));

  // Update the displayed search history
  addHistory(cities);
}

// Function to display search history
function addHistory(cities) {
  // Retrieve search history from local storage if not provided
  if (!cities) {
    cities = JSON.parse(localStorage.getItem('cities')) || [];
  }

  // Clear the displayed search history
  $('#history').empty();

  // Loop through each city in the search history
  for (const historyCity of cities) {
    // Create a button element for the city
    const newCity = $('<button>').text(historyCity).addClass('btn btn-secondary col-12 mt-1 city-button');

    // Append the button to the search history container
    $('#history').append(newCity);
  }

  // Add click event listener to each city button to load its weather data
  $('.city-button').click(loadHistoryCity);
}

// Function to load weather data for a city from the search history
function loadHistoryCity(event) {
  // Get the city name from the clicked button
  const city = event.target.textContent;

  // Fetch current weather data for the city
  getCurrentWeather(city);
}

// Document ready event handler
$(document).ready(function () {
  // Attach click event handler to search button
  $('#search').click(search);

  // Display search history on page load
  addHistory();
});

