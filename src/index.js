var map = L.map('map').setView([10.983594, -74.804334], 15);
var marker = null;
var route = null; 
var lastCoordinate = null; 
let truckMode = "1";
let lineColor = 'blue';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var APPicon = L.icon({
    iconUrl: '/gpsmarker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

function updateMarker() {
    $.ajax({
        url: 'getcoordinates.php',
        method: 'POST',
        data: {
            truck: truckMode
        },
        success: function(response){
            console.log(response)
            var data = JSON.parse(response);
            let hour = data.date.split(" ");

            drawSpeedometer(data.car_data, steps, minVal, maxVal);

            function convertToTimeZone(dateString) {
                var date = new Date(dateString);
                return date.toLocaleTimeString('en-US', { timeZone: timezone });
            }

            function convertDateToTimeZone(dateString) {
                var date = new Date(dateString);
                return date.toLocaleDateString('en-US', { timeZone: timezone });
            }

            var timezone = document.querySelector('meta[name="timezone"]').getAttribute('content');

            $("#longitude").text("Longitude: " + data.longitude);
            $("#latitude").text("Latitude: " + data.latitude);
            $("#altitude").text("Altitude: " + data.altitude);
            $("#date").text("Date: " + convertDateToTimeZone(data.date));
            $("#time").text("Time: " + convertToTimeZone(data.date));
            var latlng = [parseFloat(data.latitude), parseFloat(data.longitude)];
            if (marker === null) {
                marker = L.marker(latlng, { icon: APPicon }).addTo(map)
                    .bindPopup('Connecting to Data Base...')
                    .openPopup();
            } else {
                marker.setLatLng(latlng);
                marker.closePopup().bindPopup('Latitude: ' + data.latitude + '<br>Longitude: ' + data.longitude + '<br>RPM: ' + data.car_data);
            }
            map.setView(latlng);

            if (JSON.stringify(latlng) !== JSON.stringify(lastCoordinate)) {
                drawRoute(latlng);
                map.setView(latlng);
            }
        }
    });
}

function drawRoute(newCoordinate) {

if (lastCoordinate !== null) {
    route = L.polyline([lastCoordinate, newCoordinate], {color: lineColor}).addTo(map);
}
lastCoordinate = newCoordinate;
}

updateMarker();
setInterval(updateMarker, 3000);

$('#gpsTrackerButton').click(function() {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
});

$(document).ready(function() {
    $('#truck1').change(function() {
        truckMode = "1";
        console.log("Mode " + truckMode);
        lineColor = 'blue';
        updateMarker();
        setTimeout(function() {
            map.eachLayer(function(layer) {
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });
        },500);
        
    });
    $('#truck2').change(function() {
        truckMode = "2";
        console.log("Mode " + truckMode);
        lineColor = 'green';
        updateMarker();
        setTimeout(function() {
            map.eachLayer(function(layer) {
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });
        },500);
    });
  });
