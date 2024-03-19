<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Tracker Website</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="custom.css">
    <style>
        #map {
        width: 100%;
        height: 100%;
        }
    </style>

    <meta name="timezone" content="America/Bogota">
</head>
<body>
  <header>
    <h1>GPS Tracker </h1>
  </header>
  <main>
    <div class="container">
        <div class="item1">
            <p id="longitude">Longitude: </p>
            <p id="latitude">Latitude: </p>
            <p id="altitude">Altitude: </p>
            <p id="date">Date: </p>
            <p id="time">Time: </p>
            <p id="timestamp">Timestamp: </p>
            <button type="button" id="gpsTrackerButton">GPS Tracker</button>
	    <button type="button" id="fetchButton">Trace Route</button>
        </div>
        <div class="item2">
            <div id="map"></div>
        </div>
    </div>
  </main>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
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
        var markerInterval = null;

        $('#fetchButton').click(function() {
            clearInterval(markerInterval);
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            var startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
            var endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
            
            if (marker !== null) {
                map.removeLayer(marker);
                marker = null;
            }
            
            function updatePosition(){
                $.ajax({
                    url: 'getcoordinates2.php',
                    method: 'GET',
                    success: function(response) {
                        var coordinates = response.features[0].geometry.coordinates;

                        var latLng = L.latLng(coordinates[1], coordinates[0]);
                        if (marker === null) {
                            marker = L.marker(latLng, { icon: APPicon }).addTo(map);
                        } else {
                            marker.setLatLng(latLng)
                            marker.bindPopup('Latitude: ' + coordinates[1] + '<br>Longitude: ' + coordinates[0])
                            .openPopup();
                            
                        }

                        if (route === null) {
                            route = L.polyline([latLng]).addTo(map);
                        } else {
                            route.addLatLng(latLng);
                        }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
                });
                
            }

            setInterval(updatePosition, 3000);

        });

        $('#gpsTrackerButton').click(function() {
            updateMarker();
            markerInterval = setInterval(updateMarker, 3000);
            if (route !== null) {
                        route.remove();
            }
        });

    </script>
</body>
</html>

