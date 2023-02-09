//store the city

var city= [];
var cityname;

//local storage functions

initCityList();
initWeather();

//creating a function so the user can enter a city 

function bringCities(){
    $("#city").empty();
    $("#cityInput").val("");
    
    for (i=0; i<city.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(city[i]);
        $("#city").prepend(a);
    } 
}


//pulling the city list array from local storage

function initCityList() {
    var citiesStored = JSON.parse(localStorage.getItem("cities"));

    if (citiesStored !== null) {
        city = citiesStored;
    }
bringCities
}