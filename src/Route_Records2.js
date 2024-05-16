var map = L.map('map').setView([10.983594, -74.804334], 15);
var seed = null;
var seed2 = null;
var route = null;
var Errormarker = null;
var Startmarker = null;
var Endmarker = null;
var selectMarker = null;
var circle = null;
var latRange = 0.0;
var longRange = 0.0;
var timeMarker = null;
var windowCoords = [];
let truckMode = "1";
let lineColor = 'blue';
var windowCoords2 = [];
let route2 = null;
var windowCoords1 = [];
var bothTrucks = [];


function clearCoordinates() {
    windowCoords1 = [];
    windowCoords2 = [];
    bothTrucks = [];
}

function timeMessage(unixTimeSeconds) {
    const unixTimeMilliseconds = unixTimeSeconds * 1000;
    const date = new Date(unixTimeMilliseconds);
    const options = {
        timeZone: 'America/Bogota',
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var APPicon = L.icon({
    iconUrl: '/gpsmarker.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

var control = L.Control.geocoder({
    defaultMarkGeocode: false
}).addTo(map);


if (seed2 === null) {
    seed2 = L.marker([10.983594, -74.804334], { icon: APPicon }).addTo(map)
        .bindPopup('Select the time range in <br>' + 'the upper-center calendar 📅 <br>' + '<br>' + 'Then, you can search <br>' + 'a place in the upper <br>' + 'right corner of the map  🔎 <br>' +  '<br>' + 'Or just click on the map 📍👆🏻 <br>' + '<br>' + 'In the sidebar ☰ you can <br>' + 'select the vehicle 🚚,  use the<br>' + 'slide to see the timeline ⌚<br>' + 'and use the Full Route Button 🔵 <br>' + 'to restore the route.')
        .openPopup();
}

var startTimestamp = Math.floor(Date.now() / 1000) - 3600;
var endTimestamp = Math.floor(Date.now() / 1000);

// Cambiar esto dependiendo de como va la funcion esa
$(function() {
    $('input[name="datetimes"]').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        maxDate: new Date(),
        locale: {
            format: 'M/DD hh:mm A'
        }
    });

    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
        startTimestamp = picker.startDate.unix();
        endTimestamp = picker.endDate.unix();
        console.log("Start", startTimestamp);
        console.log("End", endTimestamp);
        clearCoordinates();
        if (truckMode == "1"){
            applyCalendar("1",route,true,'blue');
        } else if (truckMode == "2") {
            applyCalendar("2",route2,true,'green');
        } else {
            getBothCoordinates();
        }
        $('#windowSliderLabel').empty();
        $('#windowSlider').empty();
        openNav()
    });
});