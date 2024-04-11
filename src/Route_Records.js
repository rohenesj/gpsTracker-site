var map = L.map('map').setView([10.983594, -74.804334], 15);
var seed = null;
var seed2 = null;
var route = null;
var Errormarker = null;
var Startmarker = null;
var Endmarker = null;
var selectMarker = null;
var circle = null;
const fetchButton = document.getElementById("fetchButton");
var latRange = 0.0;
var longRange = 0.0;
var timeMarker = null;
var windowCoords = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var APPicon = L.icon({
    iconUrl: '/gpsmarker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

var control = L.Control.geocoder({
    defaultMarkGeocode: false
}).addTo(map);

if (seed === null) {
    seed = L.marker([10.991865,  -74.833637], { icon: APPicon }).addTo(map)
        .bindPopup('Select time range <br>' + 'and click the <br>' + 'Fetch Route Button.')
        .openPopup();
}

if (seed2 === null) {
    seed2 = L.marker([10.991865,  -74.773420], { icon: APPicon }).addTo(map)
        .bindPopup('To search a place, click <br>' + 'on the search button. <br>' + 'Or you can click on <br>' + 'Select on map.')
        .openPopup();
}

var startTimestamp = Math.floor(Date.now() / 1000) - 3600;
var endTimestamp = Math.floor(Date.now() / 1000);
$(function() {
    $('input[name="datetimes"]').daterangepicker({
      timePicker: true,
      startDate: moment().startOf('hour'),
      endDate: moment().startOf('hour').add(32, 'hour'),
      maxDate: new Date(),
      locale: {
        format: 'M/DD hh:mm A'
      }
    }, function(start, end, label){

      startTimestamp = start.unix();
      endTimestamp = end.unix();
      console.log("Start", startTimestamp);
      console.log("End",endTimestamp);
      fetchButton.disabled = false;


    });
});

$('#fetchButton').click(function() {
    $.ajax({
        url: 'getcoordinates2.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            endTime: endTimestamp
        },
        success: function(response) {
            $('#Error').empty();
            var coordinates = response;
            var latLngs = [];
            removeMarkers();
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });            

            if (!coordinates || coordinates.features.length === 0) {
                map.setView([10.983594, -74.804334], 15)
                $('#Error').html("<p class='error-message'>No coordinates in the selected time range.</p>");
                Errormarker = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
                .bindPopup('No coordinates in the selected time range')
                .openPopup();
                
            return; 
            }


            coordinates.features.forEach(function(feature, index) {
                var coords = feature.geometry.coordinates;
                var latLng = L.latLng(coords[1], coords[0]);
                latLngs.push(latLng);
                
                if (index === 0) {
                    Startmarker = L.marker(L.latLng(coords[1], coords[0]), { icon: APPicon }).addTo(map)
                        .bindPopup('Start of route. <br> ' + 'Latitude: ' + coords[1] + '<br> Latitude: ' + coords[0]);
                } 

                if (index === coordinates.features.length - 1) {
                    Endmarker = L.marker(latLng, { icon: APPicon }).addTo(map)
                        .bindPopup('End of route. <br> ' + 'Latitude: ' + coords[1] + '<br> Longitude: ' + coords[0]);
                }

            });

            route = L.polyline(latLngs, {color: 'blue'}).addTo(map);
            map.fitBounds(route.getBounds());
            
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
});

function fetchCoordinates(startTimestamp,endTimestamp,latRange,longRange) {
    $.ajax({
        url: 'getcoordinates3.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            endTime: endTimestamp
        },
        success: function(response) {
            $('#Error').empty();
            var coordinates = response;
            if (!coordinates || coordinates.features.length === 0) {
                map.setView([10.983594, -74.804334], 15)
                $('#Error').html("<p class='error-message'>No coordinates in the selected time range.</p>");
                Errormarker = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
                .bindPopup('No coordinates in the selected time range')
                .openPopup();
                
            return; 
            }
            latLngs = []
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                map.removeLayer(layer);
                }
            });
            windowCoords = [];
            coordinates.features.forEach(function(feature, index) {
                var coords = feature.geometry.coordinates;
                var tstamp = parseFloat(feature.properties.timestamp);
                var date = feature.properties.date;
                if ((coords[0] >= (longRange - 0.00225)) && (coords[0] <= (longRange + 0.00225))) {
                    if ((coords[1] >= (latRange - 0.00225)) && (coords[1] <= (latRange + 0.00225))) {
                        var latLng = L.latLng(coords[1], coords[0]);
                        latLngs.push(latLng);
                        var point = [coords[1], coords[0], tstamp];
                        windowCoords.push(point)
                    }
                }
            });
            if (windowCoords.length < 2){
                $('#windowSliderLabel').empty();
                $('#windowSlider').empty();
            } else {
                $('#windowSliderLabel').empty();
                $('#windowSlider').empty();
                $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
                var slider = $('<input type="range" class="form-range "id="myRange" min="0" max="' + windowCoords.length + '" value="50">');
                $('#windowSlider').append(slider);
            }
            route = L.polyline(latLngs, {color: 'blue'}).addTo(map);
        }
    });
}


control.on('markgeocode', function(e) {
    var location = e.geocode.center;
    latitude = location.lat;
    longitude = location.lng;
    removeMarkers();

    if (selectMarker === null) {
        selectMarker = L.marker([latitude, longitude], { icon: APPicon }).addTo(map)
            .bindPopup('Latitude: ' + latitude + '<br>Longitude: ' + longitude)
            .openPopup();
        map.setView([latitude, longitude], 16);
    }

    latRange = latitude;
    longRange = longitude;

    leftCorner = [latRange - 0.00225, longRange - 0.00225];
    rightCorner = [latRange + 0.00225, longRange + 0.00225];
    var bounds = [leftCorner, rightCorner];

    L.rectangle(bounds, {
        color: "blue", 
        fillColor:"blue",
        fillOpacity: 0.2
    }).addTo(map);
    map.fitBounds(bounds);
    fetchCoordinates(startTimestamp,endTimestamp,latRange,longRange);
});


function addMarker(e) {
    var latitude = e.latlng.lat;
    var longitude = e.latlng.lng;
    removeMarkers();

    latRange = latitude;
    longRange = longitude;

    leftCorner = [latRange - 0.00225, longRange - 0.00225];
    rightCorner = [latRange + 0.00225, longRange + 0.00225];
    var bounds = [leftCorner, rightCorner]

    L.rectangle(bounds, {
        color: "blue", 
        fillColor:"blue",
        fillOpacity: 0.2
    }).addTo(map);
    map.fitBounds(bounds);
    fetchCoordinates(startTimestamp,endTimestamp,latRange,longRange);
}

function removeMarkers() {

    if (seed !== null) {
        map.removeLayer(seed);
    }

    if (seed2 !== null) {
        map.removeLayer(seed2);
    }
    
    if (Startmarker !== null) {
        map.removeLayer(Startmarker);
    }

    if (Endmarker !== null) {
        map.removeLayer(Endmarker);
    }

    if (Errormarker !== null) {
        map.removeLayer(Errormarker);
    }

    if (selectMarker !== null) {
        map.removeLayer(selectMarker);
        selectMarker = null;
    }

    if (circle !== null) {
        map.removeLayer(circle);
        circle = null;
    }

    map.eachLayer(function(layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    map.eachLayer(function(layer) {
        if (layer instanceof L.marker) {
            map.removeLayer(timeMarker)
        }
    });
}

$(document).ready(function() {
    $('#windowSlider').on('input', '#myRange', function() {
        var sliderValue = $(this).val();
        console.log(sliderValue);
        console.log(windowCoords);
    });
});

map.on('click',addMarker);
