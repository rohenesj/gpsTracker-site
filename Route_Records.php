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
    h1 {
      margin-right: 100px; 
    }
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
    <a href="/">Real-Time Route</a>
  </header>
  <main>
    <div class="container">
        <div class="item1">
            <h2>Track vehicle in a given time:</h2>
            <form id="searchForm" method="post" action="getcoordinates2.php">
                <label for="startTime">Start Date & Time:</label>
                <input type="datetime-local" id="startTime" name="startTime" required><br><br>
                <label for="endTime">End Date & Time:</label>
                <input type="datetime-local" id="endTime" name="endTime" required><br><br>
                <button type="button" id="fetchButton">Fetch Route</button>
            </form>

            <div id="timestamps"></div>
	    <div id="Error"></div>
        </div>
        <div class="item2">
            <div id="map"></div>
        </div>
    </div>
  </main>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="src/Route_Records.js"></script>
    <script src="src/maxTime.js"></script>
</body>
</html>
