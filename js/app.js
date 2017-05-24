// VARIABLES WE'LL NEED
var errorMsg, lat, lng, units;
var apiKey = 'YOUR-API-KEY';

// DOM elements
var loader = document.getElementById('loader');
var page = document.getElementById('page');
var main = document.getElementById('main');
var info = document.getElementById('addtl-info');
var forecastContainer = document.getElementById('forecast');
var forecastDay1 = document.getElementById('day1');
var forecastDay2 = document.getElementById('day2');
var forecastDay3 = document.getElementById('day3');
var settings = document.getElementById('settings');
var radioBtns = document.querySelectorAll('input[type="radio"]');

// Icons
var iconPath = 'https://res.cloudinary.com/dh1jutnwk/image/upload/';
var icons = {
	'chanceflurries': 'v1495651313/fcc-weather-app/light-snow.svg',
	'chancerain': 'v1495651320/fcc-weather-app/rain-lt.svg',
	'chancesleet': 'v1495651321/fcc-weather-app/sleet.svg',
	'chancesnow': 'v1495651313/fcc-weather-app/light-snow.svg',
	'chancetstorms': 'v1495651324/fcc-weather-app/thunderstorm.svg',
	'clear': 'v1495651323/fcc-weather-app/sunny.svg',
	'cloudy': 'v1495651310/fcc-weather-app/cloudy.svg',
	'flurries': 'v1495651313/fcc-weather-app/light-snow.svg',
	'fog': 'v1495651310/fcc-weather-app/fog.svg',
	'hazy': 'v1495651310/fcc-weather-app/fog.svg',
	'mostlycloudy': 'v1495651315/fcc-weather-app/mostly-cloudy.svg',
	'mostlysunny': 'v1495651315/fcc-weather-app/mostly-sunny.svg',
	'partlycloudy': 'v1495651315/fcc-weather-app/mostly-sunny.svg',
	'partlysunny': 'v1495651315/fcc-weather-app/mostly-cloudy.svg',
	'sleet': 'v1495651321/fcc-weather-app/sleet.svg',
	'rain': 'v1495651318/fcc-weather-app/rain-hvy.svg',
	'snow': 'v1495651313/fcc-weather-app/hvy-snow.svg',
	'sunny': 'v1495651323/fcc-weather-app/sunny.svg',
	'tstorms': 'v1495651324/fcc-weather-app/thunderstorm.svg',
	'unknown': 'v1495651325/fcc-weather-app/unknown.svg',
};

// Object to hold data for current conditions from API
var conditionsAndInfo = {
	'imperial': {
		'temp': '',
		'tempFeel': '',
		'wind': '',
		'pressure': '',
		'visibility': '',
	},

	'metric': {
		'temp': '',
		'tempFeel': '',
		'wind': '',
		'pressure': '',
		'visibility': '',
	},

	'location': '',
	'description': '',
	'relHumidity': '',
	'icon': '',

};

// Object to hold data for forecast from API
var forecast = {
	'day1': {
		'imperial': {
			'temp': '',
		},
		'metric': {
			'temp': '',
		},
		'day': '',
		'icon': '',
	},
	'day2': {
		'imperial': {
			'temp': '',
		},
		'metric': {
			'temp': '',
		},
		'day': '',
		'icon': '',
	},
	'day3': {
		'imperial': {
			'temp': '',
		},
		'metric': {
			'temp': '',
		},
		'day': '',
		'icon': '',
	},
};

// CHANGING UNITS
function setContent(units) {
	var mainIconType = conditionsAndInfo.icon;
	var mainIcon = '<img src="' + iconPath + icons[mainIconType] + '" class="icon">';
	var day1IconType = forecast.day1.icon;
	var day1Icon = '<img src="' + iconPath + icons[day1IconType] + '" class="icon">';
	var day2IconType = forecast.day2.icon;
	var day2Icon = '<img src="' + iconPath + icons[day2IconType] + '" class="icon">';
	var day3IconType = forecast.day3.icon;
	var day3Icon = '<img src="' + iconPath + icons[day3IconType] + '" class="icon">';
	
	if(units === 'imperial') {
		main.innerHTML = conditionsAndInfo.location + mainIcon + conditionsAndInfo.description + conditionsAndInfo.imperial.temp;
		info.innerHTML = conditionsAndInfo.imperial.tempFeel + conditionsAndInfo.relHumidity + conditionsAndInfo.imperial.wind + conditionsAndInfo.imperial.pressure + conditionsAndInfo.imperial.visibility;
		forecastDay1.innerHTML = forecast.day1.day + day1Icon + forecast.day1.imperial.temp;
		forecastDay2.innerHTML = forecast.day2.day + day2Icon + forecast.day2.imperial.temp;
		forecastDay3.innerHTML = forecast.day3.day + day3Icon + forecast.day3.imperial.temp;
	} else {
		main.innerHTML = conditionsAndInfo.location + mainIcon + conditionsAndInfo.description + conditionsAndInfo.metric.temp;
		info.innerHTML = conditionsAndInfo.metric.tempFeel + conditionsAndInfo.relHumidity + conditionsAndInfo.metric.wind + conditionsAndInfo.metric.pressure + conditionsAndInfo.metric.visibility;
		forecastDay1.innerHTML = forecast.day1.day + day1Icon + forecast.day1.metric.temp;
		forecastDay2.innerHTML = forecast.day2.day + day2Icon + forecast.day2.metric.temp;
		forecastDay3.innerHTML = forecast.day3.day + day3Icon + forecast.day3.metric.temp;
	}

	page.classList.add('active');
	info.classList.add('active');
	forecastContainer.classList.add('active');
	settings.classList.add('active');
	loader.classList.add('loaded');
}

function changeUnits(evt) {
	units = evt.target.value;
	setContent(units);
}

for(var j = 0; j < radioBtns.length; j++) {
	radioBtns[j].addEventListener('click', changeUnits);
}

// CONNECTING TO API AND POPULATING BLANK OBJECTS
function apiConnect(apiPath) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if(xhr.status === 200) {
				var obj = JSON.parse(xhr.responseText);
				//console.log(obj);

				conditionsAndInfo.icon = obj.current_observation.icon;
				conditionsAndInfo.imperial.temp = '<span class="temp">' + Math.round(obj.current_observation.temp_f) + '<sup>&deg;F</sup></span>';
				conditionsAndInfo.metric.temp = '<span class="temp">' + Math.round(obj.current_observation.temp_c) + '<sup>&deg;C</sup></span>';
				conditionsAndInfo.imperial.tempFeel = '<div class="temp-feel">Feels Like: <span>' + Math.round(obj.current_observation.feelslike_f) + '<sup>&deg;F</sup></div>';
				conditionsAndInfo.metric.tempFeel = '<div class="temp-feel">Feels Like: <span>' + Math.round(obj.current_observation.feelslike_c) + '<sup>&deg;C</sup></div>';
				conditionsAndInfo.imperial.wind = '<div class="wind-sp">Wind: <span>' + obj.current_observation.wind_dir + ' ' + Math.round(obj.current_observation.wind_mph) + ' mph</span></div>';
				conditionsAndInfo.metric.wind = '<div class="wind-sp">Wind: <span>' + obj.current_observation.wind_dir + ' ' + Math.round(obj.current_observation.wind_kph) + ' kph</span></div>';
				conditionsAndInfo.imperial.pressure = '<div class="pressure">Pressure: <span>' + obj.current_observation.pressure_in + ' in</span></div>';
				conditionsAndInfo.metric.pressure = '<div class="pressure">Pressure: <span>' + obj.current_observation.pressure_mb + ' mb</span></div>';
				conditionsAndInfo.imperial.visibility = '<div class="visibility">Visibility: <span>' + obj.current_observation.visibility_mi + ' mi</span></div>';
				conditionsAndInfo.metric.visibility = '<div class="visibility">Visibility: <span>' + obj.current_observation.visibility_km + ' km</span></div>';
				conditionsAndInfo.location = '<span class="location">' + obj.current_observation.display_location.full + '</span>';
				conditionsAndInfo.description = '<span class="desc">' + obj.current_observation.weather + '</span>';
				conditionsAndInfo.relHumidity = '<div class="humidity">Relative Humidity: <span>' + obj.current_observation.relative_humidity + '</span></div>';

				forecast.day1.imperial.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[1].high.fahrenheit) + '<sup>&deg;F</sup></span>';
				forecast.day1.metric.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[1].high.celsius) + '<sup>&deg;C</sup></span>';
				forecast.day1.day = '<span class="day">' + obj.forecast.simpleforecast.forecastday[1].date.weekday_short + '</span>';
				forecast.day1.icon = obj.forecast.simpleforecast.forecastday[1].icon;

				forecast.day2.imperial.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[2].high.fahrenheit) + '<sup>&deg;F</sup></span>';
				forecast.day2.metric.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[2].high.celsius) + '<sup>&deg;C</sup></span>';
				forecast.day2.day = '<span class="day">' + obj.forecast.simpleforecast.forecastday[2].date.weekday_short + '</span>';
				forecast.day2.icon = obj.forecast.simpleforecast.forecastday[2].icon;

				forecast.day3.imperial.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[3].high.fahrenheit) + '<sup>&deg;F</sup></span>';
				forecast.day3.metric.temp = '<span class="temp">' + Math.round(obj.forecast.simpleforecast.forecastday[3].high.celsius) + '<sup>&deg;C</sup></span>';
				forecast.day3.day = '<span class="day">' + obj.forecast.simpleforecast.forecastday[3].date.weekday_short + '</span>';
				forecast.day3.icon = obj.forecast.simpleforecast.forecastday[3].icon;

				setContent(units);
			} else {
				main.innerHTML = '<span class="error">We\'re sorry, but there was a problem.</span>';
				page.classList.add('active');
				loader.classList.add('loaded');
			}
		}
	};

	xhr.open('GET', apiPath, true);
	xhr.send();
}

// INIT
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		
		for(var i = 0; i < radioBtns.length; i++) {
			if(radioBtns[i].checked) {
				units = radioBtns[i].value;
			}
		}
		apiConnect('https://api.wunderground.com/api/' + apiKey + '/forecast/conditions/q/' + lat + ',' + lng + '.json');
	}, function() {
		errorMsg = '<span class="error">We\'re sorry, but you must allow access to your current location to check the weather.</span>';
		main.innerHTML = errorMsg;
		page.classList.add('active');
		loader.classList.add('loaded');
	});
} else {
	errorMsg = '<span class="error">We\'re sorry, but geolocation is not available on this device.</span>';
	main.innerHTML = errorMsg;
	page.classList.add('active');
	loader.classList.add('loaded');
}