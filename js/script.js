//openweathermap credentials
var baseURL = "http://api.openweathermap.org/data/2.5/weather";
var apiKey = "4b663000ebfd94a4317afea3b5529a34";
//other vars for global scope
var msg;
var typesList = [];
var lat;
var lon;
var contentString;

function pageLoaded(){
    
    //call getPosition() 
   getPosition();
    
    //function to getPosition if user allows, if use allows, get weather and map, if not, tell user it won't work
    
    function getPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                
                //store lat and lon
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                
                //try making call to weather api
                $.getJSON(baseURL + "?lat=" + lat + "&lon=" + lon +  "&units=metric" + "&APPID=" +apiKey, function(data){
                    
                    //grab required weather data for page from JSON object
                    //city name
                    var city = data.name;                    
                    //country
                    var country = data.sys.country;
                    //weather description
                    var desc = data.weather[0].description;
                    //humidity
                    var humidity = data.main.humidity;
                    //temperature    
                    var temp = data.main.temp;
                    //high for day
                    var tempMax = data.main.temp_max;
                    //low for day
                    var tempMin = data.main.temp_min;
                    //icon to display
                    var icon = data.weather[0].icon;
                    //img tag with icon var passed in
                    var img = "<img id='weather_icon' src='http://openweathermap.org/img/w/" + icon + ".png'>";
                    
                   //add required weather data to html for widget
                    $('#weather_widget').html('<div id="city_coutr">' + city + ', ' + country + '</div>');
                    $('#weather_widget').append('<div id="desc">' + desc + '</div>');
			        $('#weather_widget').append(img);			
                    $('#weather_widget').append('<div id="temp">' + temp + '&#8451;' + '</div>'); 
                    $('#weather_widget').append('<div id="temp_hilo">' + 'High: ' + tempMax + ', ' + 'Low: ' + tempMin +  '</div>'); 
                    
                    //check weather conditions to compile places list
                    //first, check for to ensure description is not associated with bad weather
                    if(desc !== 'shower rain' && desc !== 'rain' && desc !== 'thunderstorm' && desc !== 'snow' && desc !== 'mist'){
                        //if humidity, temp, and tempMin all okay, get outside
                        if(humidity < 60 && temp >= 14 && tempMin >= 14){
                            msg = "Let's get you Outside! Checkout our Suggestions.";
                            
                            typesList = ["park", "stadium", "rv_park", "campground", "zoo", "bar", "night_club", "amusement_park"];
                                
                        } else {
                            msg = "Better Stay Inside! Checkout our Suggestions.";
                            
                            typesList = ["cafe", "bowling_alley", "library", "movie_theater", "shopping_mall", "spa",];
                        }
                        
                    } else {
                        
                        msg = "Better Stay Inside! Checkout our Suggestions.";
                        
                         typesList = ["cafe", "bowling_alley", "library", "movie_theater", "shopping_mall", "spa"];
                        
                    }
                    
                    //output message to div                     
                    $('#msg').html(msg);
                    
                    //store location object
                    var myLocal = {
                        lat: lat,
                        lng: lon
                    }
                    
                    
                    var map = new google.maps.Map(document.getElementById('map'), {
                         zoom: 10,
                         center: myLocal
                   });
                    
                    
                    //generate a random number between 0 & typesList.length to use as random index
                    function randomInRange(min, max){
                        return Math.random() * (max-min) + min;
                    }
                    
                    
                    //grab index based on random number
                    var randomType = typesList[Math.floor(randomInRange(0,typesList.length - 1))];
                    
                    var request = {
        
                        location: myLocal,
                        radius: '5000',
                        type: randomType   
                    };
    
                    var service = new google.maps.places.PlacesService(map);
                    service.textSearch(request, callback);
    
                    function callback(results, status) {                        
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < results.length; i++) {
                                    
                                var place = results[i];    
                                                           
                                outputInfo(results[i].name,results[i].rating,results[i].formatted_address);
        
                            createMarker(results[i]);
        
                        }
                    } else {
                        $('#output').html('<span class="error text-danger">Sorry, No results. Please refresh to try again.</span>');
                    }
                        
                }//end callback()
                    
                    var infowindow = new google.maps.InfoWindow({
                                content: contentString
                    });                 
                    
    
                    function createMarker(place) {
                        var placeLoc = place.geometry.location;
                        var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent(place.name);
                            infowindow.open(map, this);
                    });
                }
    
                    function outputInfo(name, rating, vicinity){
                                              
                         output.innerHTML += "<div id='loca_name'>" + name + "</div>" +
                            "<div id='loc_rating'>" + 'Rating: '+ rating + "</div>" +
                            "<div id='loca_vicin'>" + vicinity + "</div>";        
                    }
                    
                });// end of weather api call         
                
            }, function(){                
                $('#msg').html('<span class="error text-danger"> Sorry, Activity Forecast cannot work without your location :(  </span>');
            });
        }else{
            
            $('#msg').html('<span class="error text-danger">Sorry, your Browser does not support Activity Forecast.</span>');            
        }
    }//end getPosition()    
    
}//end pageLoaded()

window.onload = pageLoaded;

            
        
        
    



