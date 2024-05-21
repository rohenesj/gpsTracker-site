var map = L.map('map').setView([10.983594, -74.804334], 15);
var radiusinLatLong = 0.00225;
var seed = null;
var seed2 = null;
var route = null;
var Errormarker = null;
var Startmarker = null;
var Endmarker = null;
var selectMarker = null;
var latRange = 0.0;
var longRange = 0.0;
var timeMarker = null;
var windowCoords = [];
let truckMode = "1";
let lineColor = 'blue';
var windowCoords2 = [];
let route2 = null;
var windowCoords1 = [];
var bothTrucks = [];
var truckRequest1 = null;
var truckRequest2 = null;
var polylineData1 = [];
var polylineData2 = [];
var polylineLayer1 = null;
var polylineLayer2 = null;
var truck1Filtered = null;
var truck2Filtered = null;
var truckFiltered = null;
var focusedCoords = null;
var marker2 = null;
var marker = null;

function clearCoordinates() {
    windowCoords1 = [];
    windowCoords2 = [];
    bothTrucks = [];
}

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
        .bindPopup('Select the time range in <br>' + 'the upper-center calendar 📅 <br>' + '<br>' + 'Then, you can search <br>' + 'a place in the upper <br>' + 'right corner of the map  🔎 <br>' +  '<br>' + 'Or just click on the map 📍👆🏻 <br>' + '<br>' + 'In the sidebar ☰ you can <br>' + 'select the vehicle 🚚,  use the<br>' + 'slide to see the timeline ⌚<br>' + 'and use the Full Route Button 🔵 <br>' + 'to restore the route.')
        .openPopup();
}

var startTimestamp = Math.floor(Date.now() / 1000) - 3600;
var endTimestamp = Math.floor(Date.now() / 1000);





// Cambiar esto dependiendo de como va la funcion esa
$(function() {
    $('input[name="datetimes"]').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        maxDate: new Date(),
        locale: {
            format: 'M/DD hh:mm A'
        }
    });

    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
        startTimestamp = picker.startDate.unix();
        endTimestamp = picker.endDate.unix();
        console.log("Start", startTimestamp);
        console.log("End", endTimestamp);
        applyToCalendar();
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        openNav();
    });
});

$(document).ready(function() {
    $('#truck1').change(function() {
        removeMarkers();
        truckMode = "1";
        lineColor = 'blue';
        console.log("Mode " + truckMode);
        selectPolyline();       
    });
    $('#truck2').change(function() {
        removeMarkers();
        truckMode = "2";
        lineColor = 'green';
        console.log("Mode " + truckMode);
        selectPolyline();
    });
    $('#truck3').change(function() {
        removeMarkers();
        truckMode = "3";
        console.log("Mode " + truckMode);
        selectPolyline();
    });
  });
function getCoordinates() {
    truckMode = "1";

    truckRequest1 = $.ajax({
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
            var latLngs = [];
            windowCoords = [];
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
                var tstamp = parseFloat(feature.properties.timestamp);
                var latLng = L.latLng(coords[1], coords[0]);
                var date = feature.properties.date;
                var carData = feature.properties.car_data;
                latLngs.push(latLng);
                var point = [coords[1], coords[0], tstamp, carData,1];
                windowCoords1.push(point)

            });
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
    truckRequest2 = $.ajax({
        url: 'getcoordinates3.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            truck: "2",
            endTime: endTimestamp
        },
        success: function(response) {
            $('#Error').empty();
            var coordinates = response;
            var latLngs = [];
            windowCoords = [];
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
                var tstamp = parseFloat(feature.properties.timestamp);
                var latLng = L.latLng(coords[1], coords[0]);
                var date = feature.properties.date;
                var carData = feature.properties.car_data;
                latLngs.push(latLng);
                var point = [coords[1], coords[0], tstamp, carData,2];
                windowCoords2.push(point)

            });
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

function fetchTruckData(callback) {
    windowCoords1 = [];
    windowCoords2 = [];
    bothTrucks = [];
    getCoordinates();
    $.when(truckRequest1,truckRequest2).done(function () {
        bothTrucks = windowCoords1.concat(windowCoords2);
        bothTrucks.sort((a, b) => a[2] - b[2]);
        polylineData1 = windowCoords1.map(function(row){
            return [row[0],row[1]];
        })
        polylineData2 = windowCoords2.map(function(row){
            return [row[0],row[1]];
        })
        callback();
    });

}

function applyToCalendar() {
    fetchTruckData(function() {
        selectPolyline();
    });
}

function selectPolyline() {
    if (polylineLayer1 === null || polylineLayer2 === null) {
        polylineLayer1 = L.polyline(polylineData1, { 
            color: 'blue', 
            smoothFactor: '2',
            weight: '5'
        }).addTo(map);
        polylineLayer2 = L.polyline(polylineData2, {
            color: 'green',
            smoothFactor: '2',
            weight: '5' 
        }).addTo(map);
    }
    if (truckMode == "1") {
        focusedCoords = windowCoords1;
        let maxValue = polylineData1.length - 1;
        polylineLayer2.setLatLngs([]);
        polylineLayer1.setLatLngs(polylineData1);
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
        map.fitBounds(polylineLayer1.getBounds());
    } else if (truckMode == "2") {
        focusedCoords = windowCoords2;
        let maxValue = polylineData2.length - 1;
        polylineLayer1.setLatLngs([]);
        polylineLayer2.setLatLngs(polylineData2); 
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
        map.fitBounds(polylineLayer2.getBounds());
    } else {
        focusedCoords = bothTrucks;
        let maxValue = bothTrucks.length - 1;
        polylineLayer1.setLatLngs([]);
        polylineLayer2.setLatLngs([]);
        polylineLayer1.setLatLngs(polylineData1);
        polylineLayer2.setLatLngs(polylineData2);
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
        let combinedBounds = polylineLayer1.getBounds().extend(polylineLayer2.getBounds());
        map.fitBounds(combinedBounds);
    }
}

function removeMarkers() {
    if (seed !== null) {
        map.removeLayer(seed);
        seed = null;
    }
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
        map.removeLayer(layer);
        }
    });
}

function addMarker(e) {
    removeMarkers();
    openNav()
    var latitude = e.latlng.lat;
    var longitude = e.latlng.lng;

    latRange = latitude;
    longRange = longitude;

    leftCorner = [latRange - radiusinLatLong, longRange - radiusinLatLong];
    rightCorner = [latRange + radiusinLatLong, longRange + radiusinLatLong];

    viewLeftCorner = [latRange - (radiusinLatLong*2), longRange - (radiusinLatLong*2)];
    viewRightCorner = [latRange + (radiusinLatLong*2), longRange + (radiusinLatLong*2)];

    var bounds = [leftCorner, rightCorner];
    var boundView = [viewLeftCorner, viewRightCorner];

    seed = L.rectangle(bounds, {
        color: lineColor, 
        fillColor: lineColor,
        fillOpacity: 0.2
    }).addTo(map);
    map.fitBounds(boundView);
    truck1Filtered = sortCoordinates(windowCoords1);
    truck2Filtered = sortCoordinates(windowCoords2);
    truckFiltered = sortCoordinates(bothTrucks);
    let polyline1Filtered = truck1Filtered.map(function(row){
        return [row[0],row[1]];
    });
    let polyline2Filtered = truck2Filtered.map(function(row){
        return [row[0],row[1]];
    });
    if (truckMode == "1") {
        focusedCoords = truck1Filtered;
        maxValue = truck1Filtered.length - 1;
        polylineLayer1.setLatLngs([]);
        polylineLayer1.setLatLngs(polyline1Filtered);
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
    } else if (truckMode == "2") {
        focusedCoords = truck2Filtered;
        maxValue = truck2Filtered.length - 1;
        polylineLayer2.setLatLngs([]);
        polylineLayer2.setLatLngs(polyline2Filtered);
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
    } else {
        focusedCoords = truckFiltered;
        maxValue = truckFiltered.length - 1;
        polylineLayer1.setLatLngs([]);
        polylineLayer1.setLatLngs(polyline1Filtered);
        polylineLayer2.setLatLngs([]);
        polylineLayer2.setLatLngs(polyline2Filtered);
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        $('#windowSliderLabel').html("<label for=\"myRange\" class=\"form-label\">Timeline</label>");
        var slider = $('<input type="range" class="form-range "id="myRange" value="0" min="0" max="' + maxValue + '" value="50">');
        $('#windowSlider').append(slider);
    }
}

function sortCoordinates(windowCoords) {
    let filteredCoords = [];
    for (let i = 0; i < windowCoords.length; i++) {
        let coords = windowCoords[i];
        if ((coords[1] >= (longRange - radiusinLatLong)) && (coords[1] <= (longRange + radiusinLatLong))) {
            if ((coords[0] >= (latRange - radiusinLatLong)) && (coords[0] <= (latRange + radiusinLatLong))) {
                filteredCoords.push(coords);
            }
        }
    }
    return filteredCoords;
}

$(document).ready(function() {
    $('#windowSlider').on('input', '#myRange', function() {
        var sliderValue = $(this).val();
        console.log(sliderValue);
        if (focusedCoords[sliderValue][4] == 1) {
            if (marker !== null){
                map.removeLayer(marker)
            }
            marker = L.marker([focusedCoords[sliderValue][0],focusedCoords[sliderValue][1]],{ icon: APPicon }).addTo(map)
            .bindPopup('Marked at ' + timeMessage(focusedCoords[sliderValue][2]) + '<br>RPM: ' + focusedCoords[sliderValue][3])
            .openPopup();
            map.setView([focusedCoords[sliderValue][0], focusedCoords[sliderValue][1]]);
    }   else {
        if (marker2 !== null) {
            map.removeLayer(marker2)
        }
        marker2 = L.marker([focusedCoords[sliderValue][0],focusedCoords[sliderValue][1]],{ icon: APPicon }).addTo(map)
        .bindPopup('Marked at ' + timeMessage(focusedCoords[sliderValue][2]) + '<br>RPM: ' + focusedCoords[sliderValue][3])
        .openPopup();
        map.setView([focusedCoords[sliderValue][0], focusedCoords[sliderValue][1]]);
    }
    });
});

$('#fullRoute').on('click', function() {
    removeMarkers();
    selectPolyline();
});

$(document).ready(function() {
    $('#radius').on('input', '#radiusValue', function() {
        var sliderValue = $(this).val();
        var currentValueInM = 250 * 2**sliderValue;
        console.log(currentValueInM);
        radiusinLatLong = 0.00225 * 2**sliderValue;
        $("#currentRadius").text(currentValueInM + "km");
    })
});
map.on('click',addMarker);