var map = L.map('map').setView([10.983594, -74.804334], 15);
var marker = null;

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
                    .bindPopup('This is a default location. <br> Connecting to Data Base...')
                    .openPopup();
            } else {
                marker.setLatLng(latlng);
                marker.bindPopup('Latitude: ' + data.latitude + '<br>Longitude: ' + data.longitude).openPopup();
            }
            map.setView(latlng);
        }
    });
}

var route = null; 

$('#fetchButton').click(function() {

    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    var endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

    $.ajax({
        url: 'getcoordinates2.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            endTime: endTimestamp
        },
        success: function(response) {
            $('#timestamps').html("<p>Start Timestamp: " + startTimestamp + "</p><p>End Timestamp: " + endTimestamp + "</p>");
            var coordinates = response;

            var latLngs = [];
            coordinates.features.forEach(function(feature) {
                var coords = feature.geometry.coordinates;
                var latLng = L.latLng(coords[1], coords[0]);
                latLngs.push(latLng);
            });

            if (route !== null) {
                route.remove();
            }

            if (map === null) {
                map = L.map('map').setView([0, 0], 2);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);
            }

            route = L.polyline(latLngs, {color: 'blue'}).addTo(map);
            map.fitBounds(route.getBounds());
            

        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
});