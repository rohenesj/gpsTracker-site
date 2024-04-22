<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Tracker!</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="style/sidebar.css" />
    <link rel="stylesheet" href="style/custom.css">
    <meta name="timezone" content="America/Bogota">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
</head>

<body>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <div id="main" class="container-fluid">
        <div class="row custom-header align-items-center">
            <div class="col-sm-12 col-md-3 col-lg-3">
                <h1 style="color:white;">
                    <button class="btn btn-outline-light" onclick="openNav()">☰</button>  
                    <img src="gpsmarker.png" alt="gpsTracker logo" style="width:45px;height:45px;">
                    GPS Tracker
                </h1>
            </div>
            <div class="col-sm-1 col-md-6 col-lg-6">
                <form id="searchForm" method="post" action="getcoordinates2.php">
                    <input type="text" name="datetimes" class="form-control" />
                </form> 
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1 offset-lg-2 offset-md-2">
                <a href="/index.php" class="btn btn-outline-light" role="button">Real Time</a>
            </div>
        </div>
        <div class="row custom-row">
                <div id="map"></div>
        </div>
    </div>


<div id="mySidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
    <h2>Select a Datapoint:</h2> 
    <div id="windowSliderLabel" class="mt-3"></div>
    <div id="windowSlider"></div>
    <div id="Error"></div>
    <div id="Debug"></div>
</div>
  </div>


  
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
  <script src="src/Route_Records.js"></script>
  <script src="src/sidebar.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
  integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" 
  integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>


</body>
</html>
