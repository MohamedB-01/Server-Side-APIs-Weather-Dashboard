var timeDisplayEl = $('#currentDay');
var cityEl= document.querySelector("#city");
var city = cityEl.value.trim();
var searchHistory = document.querySelector("#search-history");
var searchForCityBtn = document.querySelector("#searchBtn");
var apiKey = "08103b6eb7a8fe26528f481e347f6632"
var cities = [];
var displayEl = document.querySelector("#current-forecast");
var cityTitle = document.querySelector("#searched-city");            
var currentWeatherDisplay = document.querySelector("#current-weather-container");
var searchedCityEl = document.querySelector("#searched-city")
var forecastTitle = document.querySelector("#forecast");
var fiveDayContainerEl = document.querySelector("#fiveday-container");
var clearHistoryBtn = document.querySelector("#clear-history")
// function to display current time. 
function displayTime() {
    var rightNow = moment().format('dddd MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
  };
  
  setInterval(displayTime, 1000);

  // function to creat new button in search history. 
function createHistorySearchBtn (city) {
  
  var newHistoryBtn = document.createElement("button");
  
  newHistoryBtn.classList = "btn btn-info w-100 my-3" ;
  newHistoryBtn.innerHTML = city;
  newHistoryBtn.setAttribute("data-city",city)
  newHistoryBtn.setAttribute("type", "submit");
  searchHistory.prepend(newHistoryBtn);
  cities.unshift(city); 
  // event listener for newHistoryBtn
  newHistoryBtn.addEventListener("click",function (event){
    var cityVal = event.target.getAttribute("data-city")
      if(cityVal){
          getCityWeather(city);
          getFiveDay(city);
      };
  });
};



// eventListner to searchForCityBtn.
searchForCityBtn.addEventListener ("click", function (event){
  event.preventDefault();
  var city = cityEl.value.trim();
  if (city){
      getCityWeather(city);
      getFiveDay(city);
      createHistorySearchBtn(city);
      cityEl.value = "";
      saveSearch(city);
  } else {
    return;
  }
});

// function to save search to local storage 
function saveSearch(){
  localStorage.setItem("cityHistory", JSON.stringify(cities));
};
// function to retreive locally stored search history
function onLoad(){
  
  if (localStorage.getItem("cityHistory") === null) {
    return;
   } else {
    var cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    for (i = 0; i < cityHistory.length; i++ ) {
        var city = cityHistory[i];
        console.log(city);
        createHistorySearchBtn(city);
    }
  };
};

//function to display weather results 
function displayWeather (weather, searchCity){
  
  
  currentWeatherDisplay.textContent= "";  
  searchedCityEl.textContent=searchCity;

  

  //create date element
  var currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  searchedCityEl.appendChild(currentDate);

  //create an image element
  var weatherIcon = document.createElement("img")
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
  searchedCityEl.appendChild(weatherIcon);

  //create a span element to hold temperature data
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item"
 
  //create a span element to hold Humidity data
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item"

  //create a span element to hold Wind data
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item"

  //append to container
  currentWeatherDisplay.appendChild(temperatureEl);

  //append to container
  currentWeatherDisplay.appendChild(humidityEl);

  //append to container
  currentWeatherDisplay.appendChild(windSpeedEl);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat,lon)


};

function getUvIndex(lat,lon){
    var apiKey = "08103b6eb7a8fe26528f481e347f6632"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json()
        .then(function(data){
            displayUvIndex(data)
           
        });
    });
};

function displayUvIndex(index){
  var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexVal = document.createElement("span")
    uvIndexVal.textContent = index.value

    if(index.value <=2){
        uvIndexVal.classList = "bg-success"
    }
    else if(index.value >8){
        uvIndexVal.classList = "bg-danger"
    }
    else {
        uvIndexVal.classList = "bg-warning"
    };

    uvIndexEl.appendChild(uvIndexVal);

    //append index to current weather
    currentWeatherDisplay.appendChild(uvIndexEl);
};

function getCityWeather(city){
  var apiKey = "08103b6eb7a8fe26528f481e347f6632";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiURL)
  .then(function(response){
      response.json()
      .then(function(data){
          displayWeather(data, city);
      });
  });
};

function getFiveDay (city){
  var apiKey = "08103b6eb7a8fe26528f481e347f6632";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiURL)
  .then(function(response){
      response.json().then(function(data){
         displayFiveDay(data);
      });
  });
};

function displayFiveDay(weather){
  fiveDayContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
       //append to five day container
        fiveDayContainerEl.appendChild(forecastEl);
    }

};



function clearData() {
  localStorage.clear();
  location.reload();
};

clearHistoryBtn.addEventListener("click", clearData);
onLoad();

