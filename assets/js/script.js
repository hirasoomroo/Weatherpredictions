// Global variable declarations
var cityList = [];
var cityname;

// local storage functions
initCityList();
initWeather();


// This function pulls the city list array from local storage
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
    bringCities();
    }
// Created this function to bring cities when someone searches for it
function bringCities(){
    $("#cityList").empty();
    $("#cityInput").val("");
    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityList").prepend(a);
    } 
}
// Pulling from local storage to get the current city on display
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cityname = storedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
    }

// This function saves the currently display city to local storage
function storeCurrentCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityname));
}
 // This function runs the AJAX call for the 5 day forecast and displays them to the DOM
async function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=88fd1d372474f650a609b205c4d38488";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      var futureWeather = $("<div  id='fiveDayForecast'>");
      var forecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      futureWeather.append(forecastHeader);
      var cardDeck = $("<div  class='card-deck'>");
      futureWeather.append(cardDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          var forecastCard = $("<div class='card mb-3 mt-3'>");
          var cardBody = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(getCurrentWeatherIcon);
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
      }
      $("#forecastContainer").html(futureWeather);
    }     

// Make the search button work by entering city and pulling data 
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (cityList.length >= 5){  
        cityList.shift();
        cityList.push(cityname);

    }else{
    cityList.push(cityname);
    }
    storeCurrentCity();
    storeCityArray();
    bringCities();
    displayWeather();
    displayFiveDayForecast();
});

// Event handler for if the user hits enter after entering the city search term
$("#cityInput").keypress(function(e){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// Created this function to display weather including humidity, temperature and wind speed.
async function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=88fd1d372474f650a609b205c4d38488";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);

        var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        var getCurrentCity = response.name;
        var date = new Date();
        var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        var getCurrentWeatherIcon = response.weather[0].icon;
        var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
        var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
        currentCityEl.append(displayCurrentWeatherIcon);
        currentWeatherDiv.append(currentCityEl);
        var getTemp = response.main.temp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        var getHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
    }
        
      


// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityname);
    
}

$(document).on("click", ".city", historyDisplayWeather);