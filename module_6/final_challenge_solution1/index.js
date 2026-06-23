var map = L.map("map").setView([12.879, 121.774], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let chartInstance;

async function loadWeather(lat, lon, showPopup = true) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum&past_days=7&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(data);

  const labels = data.daily.time;
  const maxTemp = data.daily.temperature_2m_max;
  const minTemp = data.daily.temperature_2m_min;
  const windSpeed = data.daily.wind_speed_10m_max;
  const precipitation = data.daily.precipitation_sum;

  const city = data.timezone?.split("/")[1] || data.timezone;

  const i = labels.length - 1;

  const todayMax = maxTemp[i];
  const todayMin = minTemp[i];
  const todayWind = windSpeed[i];
  const todayPrecip = precipitation[i];

  document.querySelector("#daily-barChart").textContent =
    `Daily Weather of ${city}`;

  if (showPopup) {
    L.popup()
      .setLatLng([lat, lon])
      .setContent(
        `
        <b>${city}'s Today Weather</b><br>
        Temp: ${todayMin}°C - ${todayMax}°C<br>
        Wind: ${todayWind} kph<br>
        Precipitation: ${todayPrecip} mm
      `,
      )
      .openOn(map);
  }

  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("chart").getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Max Temp", "Min Temp", "Wind", "Precipitation"],
      datasets: [
        {
          label: "Weather Metrics",
          data: [todayMax, todayMin, todayWind, todayPrecip],
          backgroundColor: ["red", "yellow", "green", "blue"],
        },
      ],
    },
  });
}

map.on("click", (e) => {
  loadWeather(e.latlng.lat, e.latlng.lng, true);
});

loadWeather(12.879, 121.774);