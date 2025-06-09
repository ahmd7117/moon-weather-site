document.getElementById("fetchData").addEventListener("click", async () => {
  const date = document.getElementById("dob").value;
  const location = document.getElementById("location").value.split(",");
  const lat = location[0];
  const lon = location[1];

  if (!date) {
    alert("Please select a date.");
    return;
  }

  // Fetch moon phase
  const moonTime = new Date(date).getTime() / 1000;
  const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${moonTime}`);
  const moonData = await moonRes.json();
  const moon = moonData[0];

  let emoji = "🌑";
  if (moon.Phase.includes("First")) emoji = "🌓";
  else if (moon.Phase.includes("Full")) emoji = "🌕";
  else if (moon.Phase.includes("Last")) emoji = "🌗";
  else if (moon.Phase.includes("Waxing")) emoji = "🌔";
  else if (moon.Phase.includes("Waning")) emoji = "🌖";

  document.getElementById("moon").innerHTML = `
    ${emoji} <strong>${moon.Phase}</strong><br>
    Illumination: ${Math.round(moon.Illumination * 100)}%
  `;

  // Weather
  const weatherRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
  const w = await weatherRes.json();
  const d = w.daily;

  document.getElementById("weather").innerHTML = `
    Min Temp: ${d.temperature_2m_min[0]}°C<br>
    Max Temp: ${d.temperature_2m_max[0]}°C<br>
    Rain: ${d.precipitation_sum[0]} mm
  `;

  document.getElementById("resultCard").classList.remove("hidden");
});
