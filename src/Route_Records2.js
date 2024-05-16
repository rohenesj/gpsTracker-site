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
var windowCoords2 = [];
let route2 = null;
var windowCoords1 = [];
var bothTrucks = [];
var truckRequest1 = null;
var truckRequest2 = null;
var polylineData1 = [];
var polylineData2 = [];

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
        clearCoordinates();
        if (truckMode == "1"){
            applyCalendar("1",route,true,'blue');
        } else if (truckMode == "2") {
            applyCalendar("2",route2,true,'green');
        } else {
            getBothCoordinates();
        }
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        openNav()
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
                var tstamp = parseFloat(feature.properties.timestamp);
                var latLng = L.latLng(coords[1], coords[0]);
                var date = feature.properties.date;
                var carData = feature.properties.car_data;
                latLngs.push(latLng);
                var point = [coords[1], coords[0], tstamp, carData];
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
                var tstamp = parseFloat(feature.properties.timestamp);
                var latLng = L.latLng(coords[1], coords[0]);
                var date = feature.properties.date;
                var carData = feature.properties.car_data;
                latLngs.push(latLng);
                var point = [coords[1], coords[0], tstamp, carData];
                windowCoords2.push(point)

            });
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

function fetchTruckData() {
    windowCoords1 = [];
    windowCoords2 = [];
    bothTrucks = [];
    getCoordinates();
    $.when(truckRequest1,truckRequest2).done(function () {
        bothTrucks = windowCoords1.concat(windowCoords2);
        bothTrucks.sort((a, b) => a[1] - b[1]);
        polylineData1 = windowCoords1.map(function(row){
            return [row[0],row[1]];
        })
        polylineData2 = windowCoords2.map(function(row){
            return [row[0],row[1]];
        })
    });
}