<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Tracker!</title>
    <style>
    header {
      display: flex;
      align-items: center;
    }
    h1 {margin-right: 100px;}
    </style>
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
    <h1>GPS Tracker</h1>
    <a href="/Route_Records.php">Fetch Route</a>
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
            <button type="button" id="gpsTrackerButton">Erase Route</button>
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
    
</script>


</body>
</html>

