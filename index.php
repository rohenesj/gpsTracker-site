<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Tracker!</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="style/tachometer.css">
    <link rel="stylesheet" href="style/sidebar.css" />
    <link rel="stylesheet" href="style/custom.css">
    <meta name="timezone" content="America/Bogota">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

</head>

<body>
    <div id="main" class="container-fluid">
        <div class="row custom-header align-items-center">
            <div class="col-sm-11 col-md-5 col-lg-5">
                <h1 style="color:white;">
                    <button class="btn btn-outline-light" onclick="openNav()">☰</button>  
                    <img src="gpsmarker.png" alt="gpsTracker logo" style="width:45px;height:45px;">
                    GPS Tracker
                </h1>
            </div>
            <div class="col-sm-1 col-md-7 col-lg-7 d-flex justify-content-end">
                <a href="/Route_Records.php" id="historicalButton" class="btn btn-outline-light" role="button" style="margin-right: 0px;">Historical</a>
            </div>
        </div>
        <div class="row custom-row">
                <div id="map"></div>
        </div>
    </div>


<div id="mySidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
    <h2 id="coordinatesTitle"> Coordinates</h2>
    <p id="longitude">Longitude: </p>
    <p id="latitude">Latitude: </p>
    <p id="altitude">Altitude: </p>
    <p id="date">Date: </p>
    <p id="time">Time: </p>
    <h4 id="carData">RPM</h4>
    <canvas id="canvas-speedometer" width="250" height="250"></canvas>  
    <button type="button" id="gpsTrackerButton" class="btn btn-outline-primary">Erase Route</button>
    <div class="form-check" id="check1">
        <input id="truck1" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked>
        <label class="form-check-label" for="flexRadioDefault1">
            Truck #1
        </label>
    </div>
    <div class="form-check" id="check2">
        <input id="truck2" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
        <label class="form-check-label" for="flexRadioDefault2">
            Truck #2
        </label>
    </div>
</div>


  
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="src/index.js"></script>
    <script src="src/sidebar.js"></script>
    <script src="src/tachometer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" 
    integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>


</body>
</html>
