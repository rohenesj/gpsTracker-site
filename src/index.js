var map = L.map('map').setView([10.983594, -74.804334], 15);
var marker1 = null;
let marker2 = null;
var route = null; 
var lastCoordinate = null; 
let truckMode = "1";
let lineColor = 'blue';
let polylineCoords1 = [];
let polylineCoords2 = [];
let truck1Enabled = document.getElementById("truck1");
let truck2Enabled = document.getElementById("truck2");
let rpm1 = null;
let rpm2 = null;
let data1 = null;
let data2 = null;
let polylineLayer1 = null;
let polylineLayer2 = null;



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function convertToTimeZone(dateString) {
    var date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { timeZone: timezone });
}

function convertDateToTimeZone(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('en-US', { timeZone: timezone });
}
let timezone = document.querySelector('meta[name="timezone"]').getAttribute('content');

var APPicon = L.icon({
    iconUrl: '/gpsmarker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

function updateMarker() {
    $.ajax({
        url: 'getcoordinates.php',
        method: 'POST',
        data: {
            truck: truckMode
        },
        success: function(response){
            console.log(response)
            var data = JSON.parse(response);
            let hour = data.date.split(" ");

            drawSpeedometer(data.car_data, steps, minVal, maxVal);

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
            var latlng = [parseFloat(data.latitude), parseFloat(data.longitude)];
            if (marker === null) {
                marker = L.marker(latlng, { icon: APPicon }).addTo(map)
                    .bindPopup('Connecting to Data Base...')
                    .openPopup();
            } else {
                marker.setLatLng(latlng);
                marker.closePopup().bindPopup('Latitude: ' + data.latitude + '<br>Longitude: ' + data.longitude + '<br>RPM: ' + data.car_data);
            }
            map.setView(latlng);

            if (JSON.stringify(latlng) !== JSON.stringify(lastCoordinate)) {
                drawRoute(latlng);
                map.setView(latlng);
            }
        }
    });
}

function updateMarker2() {
    truckMode = "1"
    $.ajax({
        url: 'getcoordinates.php',
        method: 'POST',
        data: {
            truck: truckMode
        },
        success: function(response) {
            data1 = JSON.parse(response);
            let latlng = [parseFloat(data1.latitude), parseFloat(data1.longitude)];
            rpm1 = data1.car_data;
            if (JSON.stringify(latlng) !== JSON.stringify(polylineCoords1)) {
                polylineCoords1.push(latlng)
            }
            if (marker1 === null) {
                marker1 = L.marker(latlng, { icon: APPicon }).addTo(map)
                    .bindPopup('Connecting to Data Base...')
                    .openPopup();
            } else {
                marker1.setLatLng(latlng);
                marker1.closePopup().bindPopup('Latitude: ' + data1.latitude + '<br>Longitude: ' + data1.longitude + '<br>RPM: ' + data1.car_data);
            }
            
            if (truck1Enabled.checked) {
                drawSpeedometer(rpm1, steps, minVal, maxVal);
                $("#longitude").text("Longitude: " + data1.longitude);
                $("#latitude").text("Latitude: " + data1.latitude);
                $("#altitude").text("Altitude: " + data1.altitude);
                $("#date").text("Date: " + convertDateToTimeZone(data1.date));
                $("#time").text("Time: " + convertToTimeZone(data1.date));
                $("#carData").text("RPM: " + data1.car_data);
                //map.setView(latlng);
            }
            if (polylineLayer1 === null) {
                polylineLayer1 = L.polyline(polylineCoords1, { color: 'blue' }).addTo(map);
            }
            polylineLayer1.setLatLngs(polylineCoords1);
            
        }
    });
    truckMode = "2"
    $.ajax({
        url: 'getcoordinates.php',
        method: 'POST',
        data: {
            truck: truckMode
        },
        success: function(response) {
            data2 = JSON.parse(response);
            let latlng = [parseFloat(data2.latitude), parseFloat(data2.longitude)];
            rpm2 = data2.car_data;
            if (JSON.stringify(latlng) !== JSON.stringify(polylineCoords1))  {
                polylineCoords2.push(latlng)
            }
            if (marker2 === null) {
                marker2 = L.marker(latlng, { icon: APPicon }).addTo(map)
                    .bindPopup('Connecting to Data Base...')
                    .openPopup();
            } else {
                marker2.setLatLng(latlng);
                marker2.closePopup().bindPopup('Latitude: ' + data2.latitude + '<br>Longitude: ' + data2.longitude + '<br>RPM: ' + data2.car_data);
            }
            if (truck2Enabled.checked) {
                drawSpeedometer(rpm2, steps, minVal, maxVal);
                $("#longitude").text("Longitude: " + data2.longitude);
                $("#latitude").text("Latitude: " + data2.latitude);
                $("#altitude").text("Altitude: " + data2.altitude);
                $("#date").text("Date: " + convertDateToTimeZone(data2.date));
                $("#time").text("Time: " + convertToTimeZone(data2.date));
                $("#carData").text("RPM: " + data2.car_data);
                //map.setView(latlng);
            }
            if (polylineLayer2 === null) {
                polylineLayer2 = L.polyline(polylineCoords2, { color: 'green' }).addTo(map);
            }
            polylineLayer2.setLatLngs(polylineCoords2);
        }
    });
   
   


}

function drawRoute(newCoordinate) {

if (lastCoordinate !== null) {
    route = L.polyline([lastCoordinate, newCoordinate], {color: lineColor}).addTo(map);
}
lastCoordinate = newCoordinate;
}

//updateMarker();
//setInterval(updateMarker, 3000);
updateMarker2();
setInterval(updateMarker2,3000);

$('#gpsTrackerButton').click(function() {
        map.removeLayer(polylineLayer1);
        map.removeLayer(polylineLayer2);
        polylineLayer1 = null;
        polylineLayer2 = null;
        polylineCoords1 = [];
        polylineCoords2 = [];
});

$(document).ready(function() {
    $('#truck1').change(function() {
        updateMarker2();
        map.setView(polylineCoords1[polylineCoords1.length - 1]);
        
    });
    $('#truck2').change(function() {
        updateMarker2();
        map.setView(polylineCoords2[polylineCoords2.length - 1]);
    });
  });
