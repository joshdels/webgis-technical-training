const map = L.map("map").setView([6.1, 125.2], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// ---------------- LAYERS ----------------
let circleLayer;
let featureLayer = L.layerGroup().addTo(map);

// ---------------- CHART ----------------
let chart;

// category → color map
const colorMap = {};

// generate random color
function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

// ---------------- FETCH OSM DATA ----------------
async function fetchOSM(lat, lng, radius) {
  const query = `
[out:json];
(
  node["amenity"](around:${radius},${lat},${lng});
);
out;
`;

  const url =
    "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  const res = await fetch(url);
  const data = await res.json();

  return data.elements;
}

// ---------------- PROCESS + LAYERS ----------------
function processAndRender(elements) {
  const counts = {};

  featureLayer.clearLayers();

  elements.forEach((el) => {
    const type = el.tags.amenity || "unknown";

    counts[type] = (counts[type] || 0) + 1;

    // assign stable color per category
    if (!colorMap[type]) {
      colorMap[type] = randomColor();
    }

    // add map marker with SAME color
    if (el.lat && el.lon) {
      L.circleMarker([el.lat, el.lon], {
        radius: 6,
        color: colorMap[type],
        fillColor: colorMap[type],
        fillOpacity: 0.9,
        weight: 2,
      })
        .bindPopup(type)
        .addTo(featureLayer);
    }
  });

  updateChart(counts);
}

// ---------------- CHART ----------------
function updateChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const colors = labels.map((l) => colorMap[l]);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "bar",

    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// ---------------- CLICK MAP ----------------
map.on("click", async function (e) {
  const radius = 500;

  const { lat, lng } = e.latlng;

  // remove old circle
  if (circleLayer) map.removeLayer(circleLayer);

  // draw radius
  circleLayer = L.circle([lat, lng], {
    radius: radius,
    color: "#4CAF50",
    fillOpacity: 0.1,
  }).addTo(map);

  // fetch real GIS data
  const elements = await fetchOSM(lat, lng, radius);

  // render map + chart
  processAndRender(elements);
});
