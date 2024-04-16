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
    <!-- <link rel="stylesheet" href="custom.css"> -->
    <style>
        #map {
        width: 100%;
        height: 100%;
        }
        .custom-row {
            height: 90vh
        }
        .custom-header {
          background-color: #0d6efd
        }
        .header-link-style {
            color: black !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        .header-link-style:visited {
            color: black !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
    </style>

    <meta name="timezone" content="America/Bogota">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

</head>

<body>
    <div class="container-fluid">
        <div class="row custom-header align-items-center">
            <div class="col-sm-12 col-md-3 col-lg-3">
                <h1 style="color:white;"><img src="gpsmarker.png" alt="gpsTracker logo" style="width:45px;height:45px;">GPS Tracker</h1>
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1 offset-lg-8 offset-md-8">
                <a href="/Route_Records.php" class="btn btn-light header-link-style" role="button">Historical</a>
            </div>
        </div>
        <div class="row custom-row pt-3">
            <div class="col-sm-12 col-md-2 col-lg-2">
                <p id="longitude">Longitude: </p>
                <p id="latitude">Latitude: </p>
                <p id="altitude">Altitude: </p>
                <p id="date">Date: </p>
                <p id="time">Time: </p>
                <p id="timestamp">Timestamp: </p>
                <button type="button" id="gpsTrackerButton" class="btn btn-outline-primary">Erase Route</button>
            </div>
            <div class="col-sm-12 col-md-10 col-lg-10">
                <div id="map"></div>
            </div>
        </div>
    </div>

  
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="src/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" 
    integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>


</body>
</html>
