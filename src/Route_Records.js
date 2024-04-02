var map = L.map('map').setView([10.983594, -74.804334], 15);
var seed = null;
var route = null; 
var Errormarker = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var APPicon = L.icon({
    iconUrl: '/gpsmarker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});


if (seed === null) {
    seed = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
        .bindPopup('Select time range <br>' + 'and click the <br>' + 'Fetch Route Button.')
        .openPopup();
}


$('#fetchButton').click(function() {

    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    var endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    
    $.ajax({
        url: 'getcoordinates2.php',
        method: 'POST',
        data: {
            startTime: startTimestamp,
            endTime: endTimestamp
        },
        success: function(response) {
            $('#timestamps').html("<p>Start Timestamp: " + startTimestamp + "</p><p>End Timestamp: " + endTimestamp + "</p>");
            var coordinates = response;
            var latLngs = [];
            var marker = null;
            var Errormarker = null;
            $('#Error').empty();

            if (!coordinates || coordinates.features.length === 0) {
                $('#Error').html("<p class='error-message'>No coordinates in the selected time range.</p>");
                Errormarker = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
                .bindPopup('No coordinates in the selected time range')
                .openPopup();

            map.eachLayer(function(layer) {
                if (layer instanceof L.Polyline) {
                    map.setView([10.983594, -74.804334], 15)
                    map.removeLayer(layer);
                    map.removeLayer(Startmarker);
                    map.removeLayer(Endmarker);
                    map.removeLayer(marker);
                    map.removeLayer(Errormarker);
                }
            });

            return; 

            }

            if (Errormarker) {
                map.removeLayer(Errormarker);
            }

            if (seed !== null) {
                map.removeLayer(seed);
                seed = null;
            }

            coordinates.features.forEach(function(feature, index) {
                var coords = feature.geometry.coordinates;
                var latLng = L.latLng(coords[1], coords[0]);
                latLngs.push(latLng);
                
                if (index === 0) {
                    Startmarker = L.marker(L.latLng(coords[1], coords[0]), { icon: APPicon }).addTo(map)
                        .bindPopup('Start of route. <br> ' + 'Latitude: ' + coords[1] + '<br> Latitude: ' + coords[0]);
                } 

                if (index === coordinates.features.length - 1) {
                    Endmarker = L.marker(latLng, { icon: APPicon }).addTo(map)
                        .bindPopup('End of route. <br> ' + 'Latitude: ' + coords[1] + '<br> Longitude: ' + coords[0]);
                }

            });

            route = L.polyline(latLngs, {color: 'blue'}).addTo(map);
            map.fitBounds(route.getBounds());
            
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
});