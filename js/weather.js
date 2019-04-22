/*
Controller for clock/time webapp
Jiahua Chen, relies on OpenWeatherMap API
Last updated 24 Feb 2019
*/

let apiKey = '715edb98d0b4bfdc98caa888994cf61e';
let city = 4960036;
let url = `https://api.openweathermap.org/data/2.5/weather?id=${city}&units=imperial&appid=${apiKey}`

$.ajax({
    url: url,
    type: 'GET',
    success: function(weather) {
        let message = `It's <b>${parseInt(weather.main.temp)}</b> degrees (${Math.round(((parseInt(weather.main.temp) - 32)/1.8) * 10) / 10} °C) in Lakeville, with <b>${weather.weather[0].description}</b>.`;
        document.getElementById("weather").innerHTML = message;
        // console.log(message);
    }
});
