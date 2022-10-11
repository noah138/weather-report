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
        .then((response) => response.json())
        .then((data) => this.displayFutureWeather(data));
        
    },
    displayFutureWeather: function(data) {
        for (i=4; i < data.list.length; i+=8) {
            var {dt} = data.list[i];
            var {temp, humidity} = data.list[i].main;
            var {speed} = data.list[i].wind
            const {id} = data.list[i].weather

            const milliseconds = dt*1000
            const dateObject = new Date(milliseconds)
            const humanDateFormat = dateObject.toLocaleString()
            const formattedDate = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
            
            console.log(formattedDate, temp, humidity, speed, id)

            // var card = $("<div>").addClass("card");
            // var cardBody = $("<div>").addClass("card-body");
            // var cardTitle = $("<h5>").addClass("card-title");
            // var cardIcon = $("<img>").addClass("card-icon");
            // var cardTemp = $("<p>").addClass("card-text");
            // var cardWind = $("<p>").addClass("card-text");
            // var cardHumidity = $("<p>").addClass("card-text");

            // var date = new Date(dt * 1000);
            // var month = date.getMonth()+1;
            // var day = date.getDate();
            // var year = date.getFullYear();
            // var formattedDate = (month+"/"+day+"/"+year);

            // var forecastIconUrl = "http://openweathermap.org/img/wn/" + id + ".png";
            
            // card.append(cardBody);
            // cardBody.append(cardTitle.text(formattedDate));
            // cardBody.append(cardIcon.attr('src', forecastIconUrl));
            // cardBody.append(cardTemp.text('Temp: ' + temp + ' °F'));
            // cardBody.append(cardHumidity.text('Wind: ' + speed + ' %'));
            // cardBody.append(cardWind.text('Humidity: ' + humidity + ' %'));
        }
    },
    search: function() {
        this.fetchFutureWeather(document.querySelector(".input-search").value);
    }
    }

document.querySelector(".btn").addEventListener("click", function() {
    event.preventDefault();
    weather.search();
    futureWeather.search();
});