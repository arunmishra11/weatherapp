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
    .then(function(response) {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(function(data) {
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
    .catch(function(error) {
      // Handle errors
      alert('Invalid city name.');
    });
}
