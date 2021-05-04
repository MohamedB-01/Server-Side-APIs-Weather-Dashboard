var timeDisplayEl = $('#currentDay');
var city = document.querySelector("#city");
var cityVal = city.value;
var searchHistory = document.querySelector("#search-history");
var searchForCityBtn = document.querySelector("#searchBtn");
var apiKey = "08103b6eb7a8fe26528f481e347f6632"
var cities = [];


// function to display current time. 
function displayTime() {
    var rightNow = moment().format('dddd MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
  };
  
  setInterval(displayTime, 1000);

  // function to creat new button in search history. 
function creatHistorySearchBtn (city) {

  var newHistoryBtn = document.createElement("button");
  var city = document.querySelector("#city");
  var cityVal = city.value.trim();
  newHistoryBtn.classList = "btn btn-secondary w-100 my-3" ;
  newHistoryBtn.innerHTML = cityVal;
  newHistoryBtn.setAttribute("type", "submit");
  searchHistory.prepend(newHistoryBtn);
  

};
// function to save search to local storage.
function saveSearch () {
  
  localStorage.setItem("ciites", cities);
};


//EventListener to handle search submit. 
searchForCityBtn.addEventListener('click', function(event){
  event.preventDefault();
  creatHistorySearchBtn();
  saveSearch();
  

});

// function to call forecast from openweather API 
function getForecast (city) {
  var apiKey = "08103b6eb7a8fe26528f481e347f6632"
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiURL)
  .then(function(response){
      response.json().then(function(data){
          displayWeather(data, city);
      });
  });
};

// function to display search results 
function displayWeather() {

}