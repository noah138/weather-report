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
        // const {icon} = data.weather;
        
        var date = new Date(timezone * 1000);
        var month = date.getMonth();
        var day = date.getDate();
        var year = date.getFullYear();
        var formattedDate = (month+"/"+day+"/"+year);

        document.querySelector('#city-name').innerText = name + " (" + formattedDate + ")"
        // document.querySelector('#icon').src = "http://openweathermap.org/img/w/" + icon + ".png"
        document.querySelector('#city-temp').innerText = "Temp: " + temp + " °F"
        document.querySelector('#city-wind').innerText = "Wind: " + speed + " MPH"
        document.querySelector('#city-humidity').innerText = "Humidity " + humidity + " %"

        function getFutureWeather(city) {
            const futureWeather = [];
            for (let i = 4; i < data.list.length; i += 8) {
                futureWeather.push(data.list[i]);
            }
        }
    },
    search: function() {
        this.fetchWeather(document.querySelector(".input-search").value);
    }
};

document.querySelector(".btn").addEventListener("click", function() {
    event.preventDefault();
    weather.search();
});