const apiKey = '9360ff9c9f6d95d042d8df33057b529a'

// DOM objects
const forecast = $('.forecast')
const searchHistory = $('#history')
const clearHistory = $('#clear-btn')

// creates list of searched cities to be stored in local storage
var cities = JSON.parse(localStorage.getItem('cities')) || [];

// appends each searched city to the search history as a list item upon page load
$(document).ready(() => {
    cities.forEach((city) => {
        searchHistory.prepend(
            $(`<li class="list-group-item text-capitalize">${city}</li>`))    
    })

// runs the weather function if a list element frmo the search history is clicked on
    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        weather.getWeather(city);
        weather.getForecast(city);
    })
})

// adds a clear history button to the end of the search history
clearHistory.on('click', function() {
    localStorage.clear();
    searchHistory.html("");
});

// when the search icon is clicked
$('.search-btn').on("click", (e) => {
    event.preventDefault();

// evaluates search entry as the city and adds it to local storage
    var city = $('input').val();
    cities.push(city);

    localStorage.setItem('cities', JSON.stringify(cities));

// adds the search to the search history
    searchHistory.prepend($(`<li class="list-group-item">${city}</li>`));

    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        weather.getWeather(city);
        weather.getForecast(city);
    })

    weather.search();
})

let weather = {
    // fetches the api according to the city and puts it into a json file
    getWeather: function(city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?q='
        + city + '&appid=' + apiKey + '&units=imperial'
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    // appends the weather information to the page
    displayWeather: function(data) {
        let dt = data.dt
        let name = data.name
        let humidity = data.main.humidity;
        let speed = data.wind.speed;
        let temp = data.main.temp;
        
        // converts dt to a readable date in the format DD/MM/YYYY
        const dateObject = new Date(dt*1000);
        const formattedDate = dateObject.toLocaleDateString();

        document.querySelector('#city-name').innerText = name + "\n(" + formattedDate + ")"
        document.querySelector('#icon').src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        document.querySelector('#city-temp').innerText = "Temp: " + temp + " °F"
        document.querySelector('#city-wind').innerText = "Wind: " + speed + " MPH"
        document.querySelector('#city-humidity').innerText = "Humidity: " + humidity + " %"
    },
    // repeats the same process above but for the five-day forecast
    getForecast: function (city) {
        // accesses the forecast api
        let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q='
        + city + '&appid=' + apiKey + '&units=imperial'
    
        fetch(queryURL)
        .then ((response) => {
            return response.json();
        })
        .then((response) => {
    
            let forecastHTML = `
            <h3>5-Day Forecast:</h3>
            <div class="d-inline-flex flex-wrap justify-content-between">`;
    
            // loops through 5 times to get information for the 5 days
            for (i=0; i<response.list.length; i++) {
                let dt = response.list[i].dt;
                let dateObject = new Date(dt*1000);
                let formattedDate = dateObject.toLocaleDateString();
                
                let dayTimeUTC = response.list[i].dt;
                let timeZoneOffset = response.city.timezone;
                let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
                let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
                
                let icon = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                
                // retrieves the weather from the next day only when it is mid day
                // takes into account 11, 12, and 13 hours because the forecast API gives weather information every 3 hours
                if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                    forecastHTML += `
                    <div class="card-body card col-sm-1 col-md-2 m-1 text-center text-white bg-secondary">
                        <ul class="list-unstyled">
                            <li id="future-date">${formattedDate}</li>
                            <li class="weather-icon"><img src="${icon}"></li>
                            <li>Temp: ${response.list[i].main.temp} °F</li>
                            <br>
                            <li>Wind: ${response.list[i].wind.speed} MPH</li>
                            <br>
                            <li>Humidity: ${response.list[i].main.humidity}%</li>
                        </ul>
                    </div>`;
                }
            }
    
            forecastHTML += '</div>'
    
            $('.forecast').html(forecastHTML);
        })
    },
    search: function() {
        this.getWeather($('.input-search').val());
        this.getForecast($('.input-search').val());
    },
};