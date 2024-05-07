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
            <div class="col-7 col-sm-6 col-md-5 col-lg-4">
                <h1 style="color:white;">
                    <button class="btn btn-outline-light" onclick="openNav()">☰</button>  
                    <img src="gpsmarker.png" alt="gpsTracker logo" style="width:45px;height:45px;">
                    GPS Tracker
                </h1>
            </div>
            <div class="col-6 col-sm-4 col-md-5 col-lg-4">
                <form id="searchForm" method="post" action="getcoordinates2.php">
                    <input type="text" name="datetimes" class="form-control" />
                </form> 
            </div>
            <div class="col-6 col-sm-2 col-md-2 col-lg-4 d-flex justify-content-end">
                <a href="/index.php" id="realtimeButton" class="btn btn-outline-light" role="button" style="margin-right: 0px;">Real Time</a>
            </div>
        </div>
        <div class="row custom-row">
                <div id="map"></div>
        </div>
    </div>


<div id="mySidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
    <h2 id="locationTitle">Select a location:</h2> 
    <div id="windowSliderLabel" class="mt-3 mobileHidden"></div>
    <div id="windowSlider" class="timeSlider"></div>
    <div id="Error"></div>
    <div id="Debug"></div>
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
  </div>


  
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
  <script src="src/Route_Records.js"></script>
  <script src="src/sidebarhistorical.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
  integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" 
  integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>


</body>
</html>
