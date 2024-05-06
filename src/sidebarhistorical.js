function openNav() {
  const screenWidth = window.screen.width;
  if (screenWidth > 767){
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("realtimeButton").style.marginRight = "250px";
    adjustGeocoderPosition("260px");

  } else {
    let size = screenWidth.toString() + 'px';
    console.log(size);
    document.getElementById("mySidebar").style.width = size;
    adjustGeocoderPosition(size);
  }
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("realtimeButton").style.marginRight = "0px";
  adjustGeocoderPosition("10px");
}

function adjustGeocoderPosition(marginRight) {
  document.querySelector(".leaflet-control-geocoder").style.marginRight = marginRight;
}
