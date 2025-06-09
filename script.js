let selectedLat = 0;
let selectedLon = 0;

const latSpan = document.getElementById('lat');
const lonSpan = document.getElementById('lon');

const map = L.map('map').setView([31.5, 74.3], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', function (e) {
  selectedLat = e.latlng.lat.toFixed(4);
  selectedLon = e.latlng.lng.toFixed(4);
  latSpan.textContent = selectedLat;
  lonSpan.textContent = selectedLon;
});

document.getElementById('checkBtn').addEventListener('click', async () => {
  const date = document.getElementById('datePicker').value;
  if (!date || !selectedLat || !selectedLon) {
    alert("Please pick a date and a location.");
    return;
  }

  // 1. Moon API
  const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${new Date(date).getTime() / 1000}`);
  const moonData = await moonRes.json();
  const moon = moonData[0];

  let icon = "🌑";
  if (moon.Phase.includes("New Moon")) icon = "🌑";
  else if (moon.Phase.includes("First Quarter")) icon = "🌓";
  else if (moon.Phase.includes("Full Moon")) icon = "🌕";
  else if (moon.Phase.includes("Last Quarter")) icon = "🌗";

  document.getElementById('moonPhase').innerHTML = `
    ${icon} <strong>${moon.Phase}</strong><br>
    Illumination: ${Math.round(moon.Illumination * 100)}%
  `;

  // 2. Weather API
  const weatherRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${selectedLat}&longitude=${selectedLon}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
  const data = await weatherRes.json();
  const d = data.daily;

  document.getElementById('weather').innerHTML = `
    🌡️ ${d.temperature_2m_min[0]}°C to ${d.temperature_2m_max[0]}°C<br>
    🌧️ Rain: ${d.precipitation_sum[0]} mm
  `;
});
