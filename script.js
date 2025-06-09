const map = L.map('map').setView([24.9,67.0], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;

L.Control.geocoder().addTo(map);

map.on('click', e => {
  if (marker) marker.remove();
  marker = L.marker(e.latlng).addTo(map);
  setCoords(e.latlng.lat, e.latlng.lng);
});

map.on('geocoder_showresult', ev => {
  if (marker) marker.remove();
  marker = L.marker(ev.result.center).addTo(map);
  setCoords(ev.result.center.lat, ev.result.center.lng);
});

function setCoords(lat, lon) {
  document.getElementById('lat').innerText = lat.toFixed(4);
  document.getElementById('lon').innerText = lon.toFixed(4);
  window.selectedLat = lat.toFixed(4);
  window.selectedLon = lon.toFixed(4);
}

document.getElementById('goBtn').onclick = async () => {
  const date = document.getElementById('dob').value;
  const lat = window.selectedLat;
  const lon = window.selectedLon;
  if (!date || !lat || !lon) return alert('Pick date and location');

  // Moon image via USNO cycle
  const moonUrl = `https://api.usno.navy.mil/moon/phase?date=${date}&coords=${lat},${lon}`;
  try {
    document.getElementById('moonImg').src = moonUrl;
  } catch {}

  const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${new Date(date).getTime()/1000}`);
  const moon = (await moonRes.json())[0];
  document.getElementById('moonPhase').innerText = `${moon.Phase} (${Math.round(moon.Illumination*100)}%)`;

  const w = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`)
    .then(r => r.json());
  const d = w.daily;
  document.getElementById('weather').innerText = `🌡️ ${d.temperature_2m_min[0]}–${d.temperature_2m_max[0]}°C | 🌧 ${d.precipitation_sum[0]} mm`;

  document.getElementById('result').classList.remove('hidden');
};

