<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Tracker!</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="custom.css">
    <style>
        #map {
        width: 100%;
        height: 100%;
        }
    </style>
</head>
<body>
  <header>
    <h1>GPS Tracker </h1>
  </header>
  <main>
    <div class="container">
        <div class="item1">
            <p id="longitude">Longitude [NEW]: </p>
            <p id="latitude">Latitude: </p>
            <p id="altitude">Altitude: </p>
            <p id="date">Date: </p>
            <p id="hour">Time: </p>
            <p id="timestamp">Timestamp: </p>
        </div>
        <div class="item2">
            <div id="map"></div>
        </div>

    </div>

    

  </main>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>

        var map = L.map('map').setView([10.983594, -74.804334], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var APPicon = L.icon({
            iconUrl: '/gpsmarker.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
        });

        var marker = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
            .bindPopup('This is a default location. <br> Connecting to Data Base...')
            .openPopup();

        function updateMarker() {
            $.ajax({
                url: 'getcoordinates.php',
                type: 'GET',
		success: function(response){
		    console.log(response)
                    var data = JSON.parse(response);
		    let hour = data.date.split(" ");
                    $("#longitude").text("Longitude: " + data.longitute);
                    $("#latitude").text("Latitude: " + data.latitude);
                    $("#altitude").text("Altitude: " + data.altitude);
                    $("#date").text("Date: " + hour[0]);
                    $("#hour").text("Time: " + hour[1])
                    $("#timestamp").text("Timestamp: " + data.timestamp);
                    var latlng = [parseFloat(data.latitude), parseFloat(data.longitute)];
                    marker.setLatLng(latlng);
                    marker.bindPopup('Latitude: ' + data.latitude + '<br>Longitude: ' + data.longitute).openPopup();
                    map.setView(latlng);
                }
            });
        }

        setInterval(updateMarker, 3000);

    </script>
</body>
</html>
