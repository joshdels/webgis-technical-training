// MAP INITIALIZATION
var map = L.map("map").setView([12.879, 121.774], 6);

// TILELAYER
var openlayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// STAND ALONE POPUP
var popup = L.popup()
  .setLatLng([12.879, 121.774])
  .setContent("I am a standalone popup.")
  .openOn(map);

  // GEOJSONLAYERS
fetch("../../../../data/watershed.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    var watershed = L.geoJSON(data, {
      style: {
        color: "#0066cc",
        weight: 2,
        fillOpacity: 0.3,
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties.New_Name || "Unknown watershed";
        const area = feature.properties.Catch_area || "Unknown Area";

        layer.bindPopup(`<h3>${name}</h3> <p>Area: ${area} m2 </p>`);
      },
    }).addTo(map);
  })
  .catch((err) => {
    console.error("GeoJSON Data can't be loaded:", err);
  });
