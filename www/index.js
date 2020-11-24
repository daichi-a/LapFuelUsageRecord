// This is a JavaScript file
window.startLat = 0;
window.startLng = 0;
window.currentLat = 0;
window.currentLng = 0;

function getCurrentLocation() {
    const locSuc = (event) => {
      window.currentLat = event.coords.latitude;
      window.currenttLng = event.coords.longitude;
      document.getElementById("CurrentLat").value = window.currentLat;
      document.getElementById("CurrentLng").value = window.currentLng;
    };

    const locFail = (event) => {

    };
    navigator.geolocation.getCurrentPosition(locSuc, locFail);
}

function setStartPosThenTimeStart(){
  getCurrentLocation();
  window.startLat = window.currentLat;
  window.startLng = window.currentLng;

}

function postFuelUsage(){
  let lap_data = document.getElementById('Lap').value;
  let fuel_usage_data = document.getElementById('FuelUsage').value;
  const obj = {Lap: lap_data, FuelUsage: fuel_usage_data};
  const body = JSON.stringify(obj);
  const headers = {
    'Conent-Type': 'application/json'
  }            
  const options = {method: 'POST', mode: 'no-cors', body, headers};
  const url = 'https://script.google.com/macros/s/AKfycbyIrNNlRVfCpnndYFhaGRLyMxDuVpnixNEt2mne/exec';

  fetch(url, options).then(res => res.json).then(console.log).catch(console.error);
}