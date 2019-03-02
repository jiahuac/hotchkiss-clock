/*
Controller for clock/time webapp
Jiahua Chen, relies on OpenWeatherMap API
Last updated 24 Feb 2019
*/

var request = new XMLHttpRequest();
let apiKey = '715edb98d0b4bfdc98caa888994cf61e';
let city = 4930396;
let url = `http://api.openweathermap.org/data/2.5/weather?id=${city}&units=imperial&appid=${apiKey}`

request.open('GET', url);

$.ajax({
    url: url,
    type: 'GET',
    success: function(weather) {
        let message = `It's <b>${weather.main.temp}</b> degrees in Lakeville, with <b>${weather.weather[0].description}</b>.`;
        document.getElementById("weather").innerHTML = message;
        console.log(message);
    }
});
