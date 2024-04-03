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
    <a href="/index.php">Index</a>
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
    <script src="src/index.js"></script>


</body>
</html>