var map = L.map('map').setView([10.983594, -74.804334], 15);
var seed = null;
var seed2 = null;
var route = null;
var Errormarker = null;
var Startmarker = null;
var Endmarker = null;
var selectMarker = null;
var circle = null;
var latRange = 0.0;
var longRange = 0.0;
var timeMarker = null;
var windowCoords = [];
let truckMode = "1";
let lineColor = 'blue';

function timeMessage(unixTimeSeconds) {
    const unixTimeMilliseconds = unixTimeSeconds * 1000;
    const date = new Date(unixTimeMilliseconds);
    const options = {
        timeZone: 'America/Bogota',
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}

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


if (seed2 === null) {
    seed2 = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
        .bindPopup('Select the time range in <br>' + 'the upper-center calendar 📅 <br>' + '<br>' + 'Then, you can search <br>' + 'a place in the upper <br>' + 'right corner of the map  🔎 <br>' +  '<br>' + 'Or just click on the map 👆🏻 <br>' + '<br>' + 'You can click the upper <br>' + 'left button ☰ to select <br>' + 'the vehicle, and use the<br>' + 'slide to see the timeline ⌚'  )
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
      applyCalendar();
      $('#windowSliderLabel').empty();
      $('#windowSlider').empty();  

    });
});


function applyCalendar() {
    $.ajax({
        url: 'getcoordinates2.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            truck: truckMode,
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

            route = L.polyline(latLngs, {color: lineColor}).addTo(map);
            map.fitBounds(route.getBounds());
            
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

function fetchCoordinates(startTimestamp,endTimestamp,latRange,longRange) {
    $.ajax({
        url: 'getcoordinates3.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            truck: truckMode,
            endTime: endTimestamp
        },
        success: function(response) {
            $('#Error').empty();
            var coordinates = response;
            if (!coordinates || coordinates.features.length === 0) {
                map.setView([latRange, longRange])
                $('#Error').html("<p class='error-message'>No coordinates in the selected time range.</p>");
                Errormarker = L.marker([latRange, longRange], { icon: APPicon }).addTo(map)
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
                var carData = feature.properties.car_data;
                if ((coords[0] >= (longRange - 0.00225)) && (coords[0] <= (longRange + 0.00225))) {
                    if ((coords[1] >= (latRange - 0.00225)) && (coords[1] <= (latRange + 0.00225))) {
                        var latLng = L.latLng(coords[1], coords[0]);
                        latLngs.push(latLng);
                        var point = [coords[1], coords[0], tstamp, carData];
                        windowCoords.push(point)
                    }
                }
            });
            var maxValue = windowCoords.length - 1;
            if (windowCoords.length < 2){
                $('#windowSliderLabel').empty();
                $('#windowSlider').empty();
            } else {
                $('#windowSliderLabel').empty();
                $('#windowSlider').empty();
                $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
                var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
                $('#windowSlider').append(slider);
            }
            route = L.polyline(latLngs, {color: lineColor}).addTo(map);
        }
    });
}


control.on('markgeocode', function(e) {
    openNav()
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

    viewLeftCorner = [latRange - 0.00450, longRange - 0.00450];
    viewRightCorner = [latRange + 0.00450, longRange + 0.00450];

    var bounds = [leftCorner, rightCorner];
    var boundView = [viewLeftCorner, viewRightCorner];

    L.rectangle(bounds, {
        color: lineColor, 
        fillColor: lineColor,
        fillOpacity: 0.2
    }).addTo(map);
    map.fitBounds(boundView);
    fetchCoordinates(startTimestamp,endTimestamp,latRange,longRange);
});


function addMarker(e) {
    openNav()
    var latitude = e.latlng.lat;
    var longitude = e.latlng.lng;
    removeMarkers();

    latRange = latitude;
    longRange = longitude;

    leftCorner = [latRange - 0.00225, longRange - 0.00225];
    rightCorner = [latRange + 0.00225, longRange + 0.00225];

    viewLeftCorner = [latRange - 0.00450, longRange - 0.00450];
    viewRightCorner = [latRange + 0.00450, longRange + 0.00450];

    var bounds = [leftCorner, rightCorner];
    var boundView = [viewLeftCorner, viewRightCorner];

    L.rectangle(bounds, {
        color: lineColor, 
        fillColor: lineColor,
        fillOpacity: 0.2
    }).addTo(map);
    map.fitBounds(boundView);
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
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
            map.removeLayer(layer);
            }
        });
        var marker = L.marker([windowCoords[sliderValue][0],windowCoords[sliderValue][1]],{ icon: APPicon }).addTo(map)
        .bindPopup('Marked at ' + timeMessage(windowCoords[sliderValue][2]) + '<br>RPM: ' + windowCoords[sliderValue][3])
        .openPopup();
    });
});

$(document).ready(function() {
    $('#truck1').change(function() {
        removeMarkers();
        truckMode = "1";
        console.log("Mode " + truckMode);
        lineColor = 'blue';
        applyCalendar();
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty(); 
        
    });
    $('#truck2').change(function() {
        removeMarkers();
        truckMode = "2";
        console.log("Mode " + truckMode);
        lineColor = 'green';
        applyCalendar();
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty(); 
    });
  });

map.on('click',addMarker);
