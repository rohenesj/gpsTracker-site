var now = new Date();
var year = now.getFullYear();
var month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are zero based
var day = ('0' + now.getDate()).slice(-2);
var hours = ('0' + now.getHours()).slice(-2);
var minutes = ('0' + now.getMinutes()).slice(-2);

// Format the datetime to YYYY-MM-DDThh:mm (required format for datetime-local input)
var datetime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

// Set the max attribute of the input element to the current datetime
document.getElementById('startTime').setAttribute('max', datetime);
document.getElementById('endTime').setAttribute('max', datetime);