// This is a JavaScript file
window.startLat = 0;
window.startLng = 0;
window.currentLat = 0;
window.currentLng = 0;
window.lastLapTime = 0;
window.currentLapTime = 0;
window.startTimeThisLap = 0;
window.currentTimeThisLap = 0;
window.numOfLap = 0;
window.lapTime = 0;
window.timerObj = null;

window.inLapArea = false;
window.inLapAreaRadius = 0.0;
window.manualLapMode = true;

function toggleLapMode(){
  if(window.manualLapMode){
    window.manualLapMode = false;
    document.getElementById("LapMode").innerText = "Auto Lap with Smartphone GPS";
  }
  else{
    window.manualLapMode = true;
    document.getElementById("LapMode").innerText = "Manual"
  }
}

function getCurrentLocation() {
    const locSuc = (event) => {
        console.log(event.coords.latitude);
        console.log(event.coords.longitude);
      window.currentLat = event.coords.latitude;
      window.currentLng = event.coords.longitude;
      document.getElementById("CurrentLat").innerText = window.currentLat;
      document.getElementById("CurrentLng").innerText = window.currentLng;
    };

    const locFail = (event) => {

    };
    navigator.geolocation.getCurrentPosition(locSuc, locFail);
}

function setStartPosThenTimeStart(){
  getCurrentLocation();
  window.startLat = window.currentLat;
  window.startLng = window.currentLng;
  window.startTimeThisLap = performance.now();
  window.numOfLap = 0;
  document.getElementById("Lap").value = window.numOfLap;
  document.getElementById("StartLat").innerText = window.startLat;
  document.getElementById("StartLng").innerText = window.startLng;

  window.timerObj = setTimeout(posCheck, 500);
}

function setCounterStopThenReset(){
  clearTimeout(window.timerObj);
  window.startLat = 0;
window.startLng = 0;
window.currentLat = 0;
window.currentLng = 0;
window.lastLapTime = 0;
window.startTimeThisLap = 0;
window.numOfLap = 0;
document.getElementById("Lap").value = window.numOfLap;
window.timerObj = null;
}


function doLap(){
  window.startTimeThisLap = window.lastLapTime = window.performance.now() - window.startTimeThisLap;

  document.getElementById("LastLapTime").innerText = (window.lastLapTime / 1000.0).toFixed(3) + " sec.";
  window.numOfLap++;
  document.getElementById("Lap").value = window.numOfLap;

  postLapTimeAndFuelUsage();
  


}

function postLapTimeAndFuelUsage(){
  let lap_data = document.getElementById('Lap').value;
  let fuel_usage_data = document.getElementById('TotalFuelUsage').value;
  const obj = {Lap: lap_data, LapTime: (window.lastLapTime / 1000.0).toFixed(3), FuelUsage: fuel_usage_data};
  const body = JSON.stringify(obj);
  const headers = {
    'Conent-Type': 'application/json'
  }            
  const options = {method: 'POST', mode: 'no-cors', body, headers};
  const url = 'https://script.google.com/macros/s/AKfycbyIrNNlRVfCpnndYFhaGRLyMxDuVpnixNEt2mne/exec';

  fetch(url, options).then(res => res.json).then(console.log).catch(console.error);
}

function posCheck(){
  document.getElementById("CurrentTime").innerText = 
    ((window.performance.now() - window.startTimeThisLap) / 1000.0).toFixed(3) + " sec.";
  window.timerObj = setTimeout(posCheck, 500);

  //GPS処理を入れる
}

function manualLap(){
  doLap();
}