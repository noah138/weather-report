let apiKey = '9360ff9c9f6d95d042d8df33057b529a'

var forecast = document.querySelector('.forecast');
// var inputValue = document.querySelector('.input-search');
// var name = document.querySelector('city-name');
// var temp = document.querySelector('city-temp');
// var wind = document.querySelector('city-wind');
// var humidity = document.querySelector('city-humidity');

// button.addEventListener('click', function() {
//     fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=9360ff9c9f6d95d042d8df33057b529a')
//         .then(response => response.json())
//         .then(data => console.log(data))

//     .catch(err => alert("Wrong city name"))
// })

let weather = {
    fetchWeather: function(city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?q='
        + city + '&appid=' + apiKey + '&units=imperial'
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        var {timezone} = data;
        var {name} = data;
        var {temp, humidity} = data.main;
        var {speed} = data.wind;
        const {icon} = data.weather;
        
        var date = new Date(timezone * 1000);
        var month = date.getMonth();
        var day = date.getDate();
        var year = date.getFullYear();
        var formattedDate = (month+"/"+day+"/"+year);

        document.querySelector('#city-name').innerText = name + " (" + formattedDate + ")"
        document.querySelector('#icon').src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
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
        .then((response2) => response2.json())
        .then((data2) => this.displayFutureWeather(data2));
        
    },
    displayFutureWeather: function(data2) {
        for (i=1; 1 < 6; i++) {
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h5>").addClass("card-title");
            var cardIcon = $("<img>").addClass("card-icon");
            var cardTemp = $("<p>").addClass("card-text");
            var cardWind = $("<p>").addClass("card-text");
            var cardHumidity = $("<p>").addClass("card-text");
            
            var forecastDate = data2.daily[i].dt;
            forecastDate = dayjs.unix(forecastDate).format('M/D/YYYY');

            var forecastIconUrl = "http://openweathermap.org/img/wn/" + data2.daily[i].weather[0].icon + ".png";
        }
    }
}
// function futureWeather(city) {
//         fetch('https://api.openweathermap.org/data/2.5/forecast?q='
//         + city + '&appid=' + apiKey + '&units=imperial'
//         )
//         .then((response2) => response2.json())
//         .then((data2) => this.displayfutureWeather(data2));

//         const futureWeather = [];
        
//         for (let i = 0; i < 6; i ++) {
//             futureWeather.push(data2.list[i]);
//         }

//         forecast.empty();

//         futureWeather.forEach((day) => {
//             const weatherCard = $('<div>').addClass('card col-md-2 bg-primary');
//             weatherCard.html( 
//                 '<div class="card-body p-md-0 p-sm-1 text-center">
//                 <h5 class="card-title">${day.dt_txt.slice(0, 10)}</h5>
//                 <img src="https://openweathermap.org/img/wn/${
//                   day.weather[0].icon
//                 }@2x.png"></img>
//                 <p class="card-text">Temp: ${day.main.temp}℉</p>
//                 <p class="card-text">Humidity: ${day.main.humidity}%</p>
//               </div>');
//         })
//     }

document.querySelector(".btn").addEventListener("click", function() {
    event.preventDefault();
    weather.search();
});