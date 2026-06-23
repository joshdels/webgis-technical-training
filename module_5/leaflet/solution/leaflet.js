// MAP INITIALIZATION
var map = L.map("map").setView([12.879, 121.774], 6);

// BASE MAP (OSM)
var openlayer = L.tileLayer(
  " https://basemapserver.geoportal.gov.ph/tiles/v2/PGP/{z}/{x}/{y}.png ",
  {
    maxZoom: 19,
  },
).addTo(map);

// MANGROVE LAYER (WMS)
var flood10k = L.tileLayer
  .wms("https://geoserver.geoportal.gov.ph/geoserver/wms", {
    layers: "geoportal:mangrove_forest",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  })
  .addTo(map);

// BOUNDARY
fetch(
  "https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2023/geojson/country/lowres/country.0.001.json",
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    var boundary = L.geoJSON(data, {
      style: {
        color: "blue",
        weight: 1,
        fillOpacity: 0,
      },
    }).addTo(map);
  })
  .catch((err) => {
    console.error("failed to load geojson", err);
  });

/* 


*/
