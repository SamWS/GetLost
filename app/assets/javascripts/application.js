// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
var map;
var geocoder;
var currentLoc;

var eventsObj = []

var markers = [];
var eventMarkers = [];


var radiusFilter;
var sportFilter;

var infoWindows = [];
var getLostTo;

var startPos;

$(document).ready(function(){


  $.ajax({
    type: "GET",
    url: "api/hobbies"
  }).done(function(response){
    // console.log(response)
    response.forEach(function(sport){
      $("#sportDrp").append("<option value="+ sport.id +">"+ sport.sport +"</option>");
      // <option value="">Pick Hobby</option>

    });
      $("#sportDrp").append("<option value=0>Any</option>");
  });


  $("#filterBtn").on("click", function(event){

      if($("#radiusDrp").val()!=="" && $("#sportDrp").val()!==""){
        console.log($("#radiusDrp").val());
        console.log($("#sportDrp").val());
        var radius_set = $("#radiusDrp").val();
        var sport_set = $("#sportDrp").val();
        clearMarkers(eventMarkers);
          if(markers.length===0 && currentLoc !== 'undefined' ){
            api_request_events("/api/events", {lat: currentLoc.lat, lng: currentLoc.lng, radius: radius_set, sport: sport_set});
          }else if(markers.length !== 0){
            api_request_events("/api/events", {lat: getLostTo.lat, lng: getLostTo.lng, radius: radius_set, sport: sport_set});
          }else{
            alert("Map not ready.");
          }
      }
    });

});

function initMap() {
  //default center location when geolocation is not available
  var melb = {lat: -37.8136, lng: 144.9631};//-37.8136, 144.9631
  var geelong = {lat: -37.8136, lng: 143.9631};
  geocoder = new google.maps.Geocoder;
  map = new google.maps.Map($('#map')[0], {
    zoom: 10,
    center: melb,
    mapTypeId: 'terrain',
    styles: [{
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
              featureType: 'transit.station',
              stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
            },{
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#6F4CFF" }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "visibility": "off" },
      { "color": "#554E71" },
      { "weight": 0.1 }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#7FB27F" },
      { "visibility": "on" }
    ]
  },{
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#5b2f23" },
      { "weight": 1.6 }
    ]
  }],
          disableDoubleClickZoom: true
  });

  // HTML 5 geolocation
  locateUser();
  map.addListener('click', function(event) {
    getLostTo = event.latLng.toJSON();
    // clearMarkers(eventMarkers);
    plotMarker(getLostTo);
    console.log(getLostTo);
    console.log(markers[0].getPosition().lat());
  });

}

var row_check = 10000000000;

setInterval(function(){
  console.log("row_check"+row_check);
  var events;
  $.ajax({
    type: "GET",
    url: "/api/events/recent",
    data: {lastCheck: row_check}
  }).done(function(response){
    console.log(response);
    row_check = response.current_count
    if(response.event_update !== null){
      events = response.event_update.map(function(evt) {
        return {id: evt.id, listing: evt.listing, sport: evt.sport, icon: evt.hobby_image_url, latLng: {lat: evt.latitude, lng: evt.longitude}}
      });
      loadMarkers(events);
    }
  });
}, 3000);

function api_request_events(route, args) {
  // request events from db and plot markers on map
  var events;
  $.ajax({
      type: "GET",
      url:route,
      data: args
    }).done(
      function(response) {
        events = response.map(function(evt) {
          return {id: evt.id, listing: evt.listing, sport: evt.sport, icon: evt.hobby_image_url, latLng: {lat: evt.latitude, lng: evt.longitude}}
        });
          console.log(events);
          loadMarkers(events);
          return events;
    });

}



//--------Geoloaction-------
function locateUser(){
  //Retrieve users's current pos via googe map api
  var pos;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Location found.');
      map.setCenter(pos);
      console.log(pos);
      currentLoc = pos;
      var marker = dropMarker([pos]);
      // add event markers around user's current location
      eventsObj.push(api_request_events("/api/events", {lat: pos.lat, lng: pos.lng, radius: 25}));

    }, function() {
      // if geolocation failed
      eventObj.push(api_request_events("/api/events", melb));
      handleLocationError(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

//Let user drop a "pin"
function plotMarker(location) {
  clearMarkers(markers);
  // clearMarkers(eventMarkers);
  closeInfoWindows(infoWindows);
  var marker = dropMarker([location],"user");

  marker.addListener('click', function(event) {
    closeInfoWindows(infoWindows);
    windowDom = "<button id='expBtn' class='expl'>Show event around</button><a href='/events/new?lat=" + event.latLng.toJSON().lat +
    "&lng=" + event.latLng.toJSON().lng + "'>Create</a>"
    var infoWindow = new google.maps.InfoWindow({map: map, pixelOffset: new google.maps.Size(0, -10),
    });

    infoWindow.setContent(windowDom);

    var updateLoc = event.latLng.toJSON();
    infoWindow.open(map, marker);
    // $("#map").on('click', '#expBtn', function(){
    //     console.log('button clicked')
    //     clearMarkers(eventMarkers);
    //     eventMarkers = [];
    //     api_request_events("/api/events", {lat: getLostTo.lat, lng: getLostTo.lng, radius: 25});
    //
    // });

    $('#expBtn').on('click', function(){
        console.log('button clicked')
        clearMarkers(eventMarkers);
        eventMarkers = [];
        api_request_events("/api/events", {lat: getLostTo.lat, lng: getLostTo.lng, radius: 25});

    });

    map.setCenter(event.latLng);
    infoWindows.push(infoWindow);


  });
  markers.shift();
  markers.push(marker);
}

//load all event markers
 function loadMarkers(locationArr) {
  locationArr.forEach(function(loc){
    var marker = dropMarker([loc.latLng],"event", loc.icon);
    eventMarkers.push(marker);
    marker.addListener('click', function(event) {

      var popupContent = "<div class='EventInfoWindow'><div class='e_name'>" + loc.listing +
      "</div><div class='hobby'>" + loc.sport + "</div><div><a href='/events/"+ loc.id +"'>Details</a></div></div>";
      var infoWindow = new google.maps.InfoWindow({content: popupContent, pixelOffset: new google.maps.Size(0, 10)});
      infoWindow.open(map, marker);
      infoWindows.push(infoWindow);

    });
  });
}

function addMarker(location) {
  //Add a marker on map
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  return marker;
}

function dropMarker(locationArr, markerType, iconUrl) {
   var marker;

   var draggable = false;
   if(markerType==="user"){
     draggable = true;
     iconUrl = "http://imgur.com/sKuevY0.png";//"http://imgur.com/D4op5Kp"
   }else if(markerType === "geoloc"){
     //icon url
   }
   for (var i = 0; i < locationArr.length; i++) {
     console.log("drop times1");
      marker = addMarkerWithTimeout(locationArr[i], i * 400, draggable, iconUrl, markerType);
   }
     return marker;
}

function addMarkerWithTimeout(position, timeout, draggable, iconUrl, markerType) {
     var marker = new google.maps.Marker({
       position: position,
       //map: map,
       animation: google.maps.Animation.DROP,
       draggable: draggable
     });

     if(markerType === "user"){
       marker.setAnimation(google.maps.Animation.BOUNCE);
     }

     if(iconUrl!=="undefined"||iconUrl!==""){
        marker.setIcon(iconUrl);
     }
     marker.addListener('dragstart', toggleBounce);
     marker.addListener('mouseup', function(event){
       if (marker.getAnimation() === null && markerType === "user") {
         marker.setAnimation(google.maps.Animation.BOUNCE);
         marker.setIcon('http://imgur.com/sKuevY0.png');
        getLostTo =event.latLng.toJSON();
        console.log(event.latLng.toJSON());
        // clearMarkers(eventMarkers);
        // api_request_events("/api/events", {lat: getLostTo.lat, lng: getLostTo.lng, radius: 25});

         marker.setIcon("http://imgur.com/sKuevY0.png");
       }

     });
     function toggleBounce() {
         if (marker.getAnimation() !== null) {
           marker.setAnimation(null);
           marker.setIcon('http://imgur.com/efOfGr2.png');
           //marker.setIcon("http://imgur.com/sKuevY0.png");
         } //else {

           //marker.setAnimation(google.maps.Animation.BOUNCE);
         //}
      }
     window.setTimeout(function() {
       marker.setMap(map);
     }, timeout);
     console.log(marker);
     return marker;
   }


function closeInfoWindows(windowArr){
  infoWindows = []
  if(windowArr !== []){
    windowArr.forEach(function(w){
      w.close();
    });
  }
}

function addInfoWindow(){

}


// Sets the map on all markers in the array.
function setMapOnAll(map, toClear) {
  for (var i = 0; i < toClear.length; i++) {
    toClear[i].setMap(null);
  }
  toClear = []
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(toClear) {
  setMapOnAll(null, toClear);
}

//Pop error message if geolocation not available
function handleLocationError(browserHasGeolocation) {
console.log(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
}

        // In the following example, markers appear when the user clicks on the map.
        // The markers are stored in an array.
        // The user can then click an option to hide, show or delete the markers.
