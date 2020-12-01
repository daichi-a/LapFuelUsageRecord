// This is a JavaScript file
// Lapエリアの半径(m)
window.maxDistFromStartLatLng = 10

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
  // StartのLatLngとの距離をヒュベニの公式で求める
  const dist = hubeny(window.startLat, window.currentLat, window.startLng, window.currentLng);
  if(dist < window.maxDistFromStartLatLng){
    //スタート地点からの距離が最初に指定した値以下の時
    if(window.inLapArea){
      //既にLapAreaに入っている場合は何もしない
    }
    else{
      // LapAreaの外から中へ入った時
      // Lapする
      doLap();
      // Lap地点にいるときは、bodyのbackground-colorを赤に
      document.body.style.backgroundColor = "#FF0000";
    }
  }
  else{
    // LapAreaから出た時だけ、フラグ処理をしてinLapAreaフラグをオフにする
    if(window.inLapArea){
      window.inLapArea = false;
      // 背景色をグレーに
      document.body.style.backgroundColor = "#ccc";
    }
  }

}


function hubeny(lat1, lng1, lat2, lng2) {
    function rad(deg) {
        return deg * Math.PI / 180;
    }
    //degree to radian
    lat1 = rad(lat1);
    lng1 = rad(lng1);
    lat2 = rad(lat2);
    lng2 = rad(lng2);

    // 緯度差
    const latDiff = lat1 - lat2;
    // 経度差算
    const lngDiff = lng1 - lng2;
    // 平均緯度
    const latAvg = (lat1 + lat2) / 2.0;
    // 赤道半径
    const a = 6378137.0;
    // 極半径
    const b = 6356752.314140356;
    // 第一離心率^2
    const e2 = 0.00669438002301188;
    // 赤道上の子午線曲率半径
    const a1e2 = 6335439.32708317;

    const sinLat = Math.sin(latAvg);
    const W2 = 1.0 - e2 * (sinLat * sinLat);

    // 子午線曲率半径M
    const M = a1e2 / (Math.sqrt(W2) * W2);
    // 卯酉線曲率半径
    const N = a / Math.sqrt(W2);

    const t1 = M * latDiff;
    const t2 = N * Math.cos(latAvg) * lngDiff;
    return Math.sqrt((t1 * t1) + (t2 * t2));
}

function manualLap(){
  doLap();
}