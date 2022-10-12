let apiKey = '9360ff9c9f6d95d042d8df33057b529a'

const forecast = $('.forecast')
const searchHistory = $('#history')
const clearHistory = $('#clear-btn')

var cities = JSON.parse(localStorage.getItem('cities')) || [];

$(document).ready(() => {
    cities.forEach((city) => {
        searchHistory.prepend(
            $(`<li class="list-group-item text-capitalize">${city}</li>`)
        )
        
    })

    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        weather.fetchWeather(city);
        weather.displayWeather(city);
        getForecast();
    })
})

clearHistory.on('click', function() {
    localStorage.clear();
    searchHistory.html("");
});

$('.search-btn').on("click", (e) => {
    event.preventDefault();
    
    var city = $('input').val();
    cities.push(city);

    localStorage.setItem('cities', JSON.stringify(cities));

    searchHistory.prepend($(`<li class="list-group-item">${city}</li>`));

    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        weather.fetchWeather(city);
    })

    weather.search();
})

let weather = {
    fetchWeather: function(city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?q='
        + city + '&appid=' + apiKey + '&units=imperial'
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        let dt = data.dt
        let name = data.name
        let humidity = data.main.humidity;
        let speed = data.wind.speed;
        let temp = data.main.temp;
        
        const dateObject = new Date(dt*1000);
        const formattedDate = dateObject.toLocaleDateString();

        document.querySelector('#city-name').innerText = name + " (" + formattedDate + ")"
        document.querySelector('#icon').src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        document.querySelector('#city-temp').innerText = "Temp: " + temp + " °F"
        document.querySelector('#city-wind').innerText = "Wind: " + speed + " MPH"
        document.querySelector('#city-humidity').innerText = "Humidity " + humidity + " %"
    },
    search: function() {
        this.fetchWeather(document.querySelector(".input-search").value);
        getForecast();
    }
};

function getForecast () {
    let city = $('.input-search').val();
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

        for (i=0; i<response.list.length; i++) {
            let dt = response.list[i].dt;
            let dateObject = new Date(dt*1000);
            let formattedDate = dateObject.toLocaleDateString();
            
            let dayTimeUTC = response.list[i].dt;
            let timeZoneOffset = response.city.timezone;
            let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
            let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
            let iconURL = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
    
            if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                forecastHTML += `
                <div class="card-body card col-2 p-2 text-center text-white bg-secondary">
                    <ul class="list-unstyled p-1">
                        <li>${formattedDate}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
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
}