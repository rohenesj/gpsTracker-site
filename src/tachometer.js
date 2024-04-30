function drawSpeedometer(val, steps, minVal, maxVal) {
  const canvas = document.getElementById('canvas-speedometer');
  const ctx = canvas.getContext("2d");
  //dimensions
  const W = canvas.width;
  const H = canvas.height;
  //Clear the canvas everytime a chart is drawn
  ctx.clearRect(0, 0, W, H);
  ctx.scale(1,1);
  const outerRingWidth = W * 0.04;
  const outerRingOffset = (W / 2) - (W * 0.08);
  
  const spanDegree = 60;
  const startDegree = 120;
  const endDegree = startDegree + (val / (maxVal - minVal) * (360 - spanDegree));
  const span = 360 - spanDegree;
  const degreeInterval = span / (steps.length - 1);

  const speedGradient = ctx.createLinearGradient(0, 500, 0, 0);
  speedGradient.addColorStop(0, '#00b8fe');
  speedGradient.addColorStop(1, '#41dcf4');

  function drawBackground(fillStyle) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, outerRingOffset + ((outerRingWidth + 5) / 2), 0, 2 * Math.PI);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = '#0d6efd';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.restore();
  }
  drawBackground('#f2f2f2');

  function drawMiniNeedle(rotation, width, speed) {
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(rotation);
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";

    const needleLength = W * 0.04;
    const needleOffset = outerRingOffset - needleLength + (outerRingWidth / 2);
    ctx.lineWidth = width;
    ctx.strokeRect(needleOffset, -1 / 2, needleLength, 1);
    ctx.restore();

    const textOffset = needleOffset - (W * 0.08);
    const x = (H / 2 + textOffset * Math.cos(rotation));
    const y = (W / 2 + textOffset * Math.sin(rotation));

    ctx.fillStyle = "#000";
    ctx.font = "700 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    ctx.fillText(speed, x, y);
  }

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }


  for (var i = 0; i < steps.length; i++) {
    const degree = degreeInterval * i + startDegree;
    drawMiniNeedle(degToRad(degree), 2, steps[i]);
  }

  function speedNeedle(rotation) {
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(rotation);

    const needleLength = W * 0.3;
    const needleOffset = outerRingOffset - needleLength + (outerRingWidth/2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00b8fe';
    ctx.strokeRect(needleOffset, -1 / 2, needleLength, 1);

    ctx.restore();
  }

  speedNeedle(degToRad(endDegree));

  function drawSpeedArc(startRotation, endRotation) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#41dcf4";
    ctx.lineWidth = outerRingWidth + (W * 0.01); //Add a bit of width to make sure we overlap the other lines
    ctx.shadowBlur = W * 0.035;
    ctx.shadowColor = "#00c6ff";

    ctx.strokeStyle = speedGradient;
    ctx.arc(W / 2, H / 2, outerRingOffset, startRotation, endRotation);
    ctx.stroke();
    ctx.restore();
  }
  drawSpeedArc(degToRad(startDegree - 0.25), degToRad(endDegree + 0.25));

  function drawInnerCircle(speed) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W * 0.1375, 0, 2 * Math.PI);
    ctx.lineWidth = W * 0.01666;
    ctx.strokeStyle = '#0d6efd';
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "700 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    ctx.fillText(val, W / 2, H / 2);

    ctx.restore();
  }
  drawInnerCircle(endDegree);
}

   
const range = (length) => Array.from({length}, (_, i) => i);
const steps = range(9).map(i => i * 1000);
const minVal = Math.min(...steps);
const maxVal = Math.max(...steps);

$(document).ready(function () {
  //canvas init
  drawSpeedometer(0, steps, minVal, maxVal);

  var speedInput = document.querySelector('#speed');
  speedInput.addEventListener('input', function () {
    drawSpeedometer(parseInt(this.value, 10), steps, minVal, maxVal);
  });
});
