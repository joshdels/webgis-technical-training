// MAP INITIALIZATION
var map = L.map("map").setView([12.879, 121.774], 6);

// BASE MAP (OSM)
var openlayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// FLOOD SUSCEPTIBILITY LAYER (WMS)
var flood10k = L.tileLayer
  .wms("https://geoserver.geoportal.gov.ph/geoserver/wms", {
    layers: "geoportal:flood10ksuscep",
    format: "image/png",
    transparent: true,
    opacity: 0.9,
    version: "1.1.1",
    attribution: "MGB / Geoportal Philippines",
  })
  .addTo(map);

// LEGEND CONTROL
var floodLegend = L.control({ position: "bottomright" });

floodLegend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <b>Flood Susceptibility</b><br>
    <img src="https://geoserver.geoportal.gov.ph/geoserver/wms?request=GetLegendGraphic&version=1.1.1&format=image/png&layer=geoportal:flood10ksuscep">
  `;

  return div;
};

floodLegend.addTo(map);
