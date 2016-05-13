// Things still to implement:
//
// 1. click limit - after 6 clicks, the map is revealed and the goal country is shown, with the previous clicks indicated
// 2. Upon successful click, the map switches to one with country borders and country names on it
// 3. positive and negative feedback to user varies based upon how many attempts/clicks remaining
// 4. Keep a record of previous countries clicked/not clicked and how many clicks it took to get it
// 5. Tell the user how far away from the desired country their last click was!!!!!

$(document).ready( function () {
  "use strict";

  var countryToClick;
  var nativeName;

  /**
  http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  * Returns a random integer between min (inclusive) and max (inclusive)
  * Using Math.round() will give you a non-uniform distribution!
  */

  $.ajax({
    method: 'GET',
    url: 'https://restcountries.eu/rest/v1/all',
    success: function (data) {
      var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
      console.info(data[randCountryNum].name);
      countryToClick = data[randCountryNum].name;
      nativeName = data[randCountryNum].nativeName;
      $(".modal").modal('show');
      $(".modal").html("Click on " + countryToClick);
      $(".well").html("Click on " + countryToClick);
      // console.log(data);
    }, error: function (request,error) {
      console.error(request);
    }
  });

// this stackoverflow helped me get my google maps call working: http://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load

  var map;

  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.29, lng: -85.585833},
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoomControl: true,
      draggableCursor: 'crosshair'
    });


    //this gets the latitude and longitude of a user's click
    google.maps.event.addListener(map, "click", function(event) {

    // put a marker where the user clickedSpot

    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    //create an object with the clickevent's latlng information within it
    var clickedSpot = {position: event.latLng, map: map};
    // console.log(clickedSpot);
    //fetch the latitude of the click
    var latitude = clickedSpot.position.lat();
    // console.log(latitude);
    //fetch the longitude of the click
    var longitude = clickedSpot.position.lng();
    // console.log(longitude);

    //this function below gets the country name based on the latLng coordinates of the click
    // this documentation provided all of my answers: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

      var geocoder = new google.maps.Geocoder;
      var latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({'location': latlng}, function(results, status) {
        console.log(results);
        // console.log(results[4].types[0]);
        if (status === google.maps.GeocoderStatus.OK) {
          placeMarker(event.latLng); // only put a map marker when the user clicks on a country
          for (var i=0; i < results.length; i++){
            if (results[i].types[0] === "country"){
              var countryClicked = results[i].formatted_address;
              if (countryClicked === countryToClick || countryClicked === nativeName){
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                $(".modal").modal('show');
                $(".modal").html("You clicked on " + countryClicked + "<br>Good Job!");
              } else {
                $(".modal").modal('show');
                $(".modal").html("You clicked on " + countryClicked + "<br>Try Again!");
              }
            } else {
              // do nothing - this level of results[i] does not contain the country name
            }
          }
        } else {
          console.log("geolocator is not ok");
          $(".modal").modal('show');
          $(".modal").html("You clicked on unclaimed nautical territory! Try again!");
        }

      });

    });

  }

});
