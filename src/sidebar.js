function openNav() {
  const screenWidth = window.screen.width;
  if (screenWidth > 767){
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  } else {
    let size = screenWidth.toString() + 'px';
    console.log(size);
    document.getElementById("mySidebar").style.width = size;
  }
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}
