let apiKey = '9360ff9c9f6d95d042d8df33057b529a'

// var button = document.querySelector('.btn');
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
        console.log(name,temp,humidity,speed)
        document.querySelector('#city-name').innerText = name + " (" + timezone + ")"
        document.querySelector('#city-temp').innerText = "Temp: " + temp + " °F"
        document.querySelector('#city-wind').innerText = "Wind: " + speed + " MPH"
        document.querySelector('#city-humidity').innerText = "Humidity " + humidity + " %"
    }
}