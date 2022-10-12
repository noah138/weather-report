let apiKey = '9360ff9c9f6d95d042d8df33057b529a'

const forecast = $('.forecast')
const searchHistory = $('#history')

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
        futureWeather.fetchFutureWeather(city);
        futureWeather.displayFutureWeather(city);
    })
})

$('.btn').on("click", (e) => {
    event.preventDefault();
    
    var city = $('input').val();
    cities.push(city);

    localStorage.setItem('cities', JSON.stringify(cities));

    searchHistory.prepend($(`<li class="list-group-item">${city}</li>`));

    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        weather.fetchWeather(city);
        weather.displayWeather(city);
        futureWeather.fetchFutureWeather(city);
        futureWeather.displayFutureWeather(city);
    })

    weather.search();
    futureWeather.search();
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
        var {dt} = data;
        var {name} = data;
        const {temp, humidity} = data.main;
        var {speed} = data.wind;
        
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
    }
};

let futureWeather = {
    fetchFutureWeather: function(city) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q='
        + city + '&appid=' + apiKey + '&units=imperial'
        )
        .then((response) => response.json())
        .then((data) => this.displayFutureWeather(data));
        
    },
    displayFutureWeather: function(data) {
        for (let i=4; i < 37; i+=8) {

            var {dt} = data.list[i];
            var {temp, humidity} = data.list[i].main;
            var {speed} = data.list[i].wind;

            const dateObject = new Date(dt*1000);
            const formattedDate = dateObject.toLocaleDateString();
            
            console.log(formattedDate, temp, humidity, speed);

            const forecastCard = forecast.addClass('card col-md-3');
            
            forecastCard.html(`
                <div class = "card-body bg-secondary text-white">
                <h4 class = "card-title">${formattedDate}</h4>
                <img src = "https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png"></img>
                <p class = "card-text"> Temp: ${temp} °F</p>
                <p class = "card-text"> Wind: ${speed} MPH</p>
                <p class = "card-text"> Humidity: ${humidity} %</p>
                </div>
            `);
            forecast.append(forecastCard);
        }
    },
    search: function() {
        this.fetchFutureWeather(document.querySelector(".input-search").value);
    }
}