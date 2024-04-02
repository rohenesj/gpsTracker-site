var map = L.map('map').setView([10.983594, -74.804334], 15);
var marker = null;
var route = null; 
var lastCoordinate = null; 

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
        type: 'GET',
        success: function(response){
            console.log(response)
            var data = JSON.parse(response);
            let hour = data.date.split(" ");

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
            $("#timestamp").text("Timestamp: " + data.timestamp);
            var latlng = [parseFloat(data.latitude), parseFloat(data.longitude)];
            if (marker === null) {
                marker = L.marker(latlng, { icon: APPicon }).addTo(map)
                    .bindPopup('Connecting to Data Base...')
                    .openPopup();
            } else {
                marker.setLatLng(latlng);
                marker.bindPopup('Latitude: ' + data.latitude + '<br>Longitude: ' + data.longitude).openPopup();
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
    route = L.polyline([lastCoordinate, newCoordinate], {color: 'blue'}).addTo(map);
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
