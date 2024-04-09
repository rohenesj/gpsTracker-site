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
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
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
            color: white !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        .header-link-style:visited {
            color: white !important;
            text-decoration: none !important;
            font-weight: bold !important;
        }
        #toggleButton { position: absolute; top: 2%; right: 1%; z-index: 1000; }
    </style>

    <meta name="timezone" content="America/Bogota">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

</head>

<body>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <div class="container-fluid">
        <div class="row custom-header align-items-center">
            <div class="col-sm-12 col-md-3 col-lg-3">
                <h1 style="color:white;"><img src="gpsmarker.png" alt="gpsTracker logo" style="width:45px;height:45px;">GPS Tracker</h1>
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1">
                <a href="/index.php" class="btn btn-link header-link-style" role="button">Real-time</a>
            </div>
        </div>
        <div class="row custom-row pt-3">
            <div class="col-sm-12 col-md-2 col-lg-2">
                <h2>Track vehicle in a given time:</h2>
                <form id="searchForm" method="post" action="getcoordinates2.php">
                    <input type="text" name="datetimes" class="form-control" />
                    <button disabled type="button" id="fetchButton" class="btn btn-outline-primary mt-3">Fetch Route</button>
                </form> 
                <div id="timestamps"></div>
                <div id="Error"></div>
            </div>
            <div class="col-sm-12 col-md-10 col-lg-10">
                <div id="map"></div>
                <button disabled type="button" id="toggleButton" class="btn btn-warning mt-3">Select on map</button>
            </div>
        </div>
    </div>

  

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="src/Route_Records.js"></script>
    <!--<script src="src/maxTime.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" 
    integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
    


</body>
</html>
